const chartType = {
  'Banners': { source: 'chartData',  title: 'Total Banners', sort: 'total', data: [{name: 'Defense', data: 'defense', type: 'bar', bgcolor: '#0000FF'}, {name: 'Offense', data: 'attack', type: 'bar', bgcolor: '#FFA500'}]},
  'Efficency': {source: 'chartData', title: 'Efficency', sort: 'attack', data: [{name: 'Rouge Actions', yId: 'rogue', data: 'rogue', type: 'line', bgcolor: '#FFA500'}, {name: 'Offense', data: 'attack', type: 'bar', bgcolor: '#0000FF'}]},
  'Home Defense': {source: 'homeDefense', title: 'Home Defense', sort: 'total', data: [{name: 'Total Squads', data: 'total', type: 'bar', bgcolor: '#0000FF'}, {name: 'Extra Battles', data: 'diff', type: 'bar', bgcolor: '#FFA500'}]},
  'Away Defense': {source: 'awayDefense', title: 'Away Defense', sort: 'total', data: [{name: 'Total Squads', data: 'total', type: 'bar', bgcolor: '#0000FF'}, {name: 'Extra Battles', data: 'diff', type: 'bar', bgcolor: '#FFA500'}]},
}
const config = {
      data: {
        datasets: []
      },
      options: {
        plugins: {
          title: {display: true, color: 'red'},
          legend: { labels: { color: 'red' } } },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: 'red',
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90
            }
          },
          y: {
            stacked: true,
            ticks: {
              color: 'red'
            }
          }
        }
      }
    }

export default function GetDataSet(opts = {}, data = [], date, type = 'Banners'){
  const { setDataSet } = opts
  let tempData = data.find(x=>x.date === date)
  if(tempData && chartType[type] ){
    let array = tempData[chartType[type].source]
    if(!array) array = tempData.chartDefense[chartType[type].source]
    array.sort((a, b)=>{
      return b[chartType[type].sort] - a[chartType[type].sort]
    })
    let tempConfig = JSON.parse(JSON.stringify(config))
    tempConfig.data.labels = array.map(x=>x.name)
    tempConfig.options.plugins.title.text = date+' '+chartType[type].title
    for(let i in chartType[type].data){
      if(chartType[type].data[i].yId) tempConfig.options.scales[chartType[type].data[i].yId] = {
        ticks: {
          color: chartType[type].data[i].bgcolor,
        },
        position: 'right'
      }
      tempConfig.data.datasets.push(
        {
          label: chartType[type].data[i].name,
          type: chartType[type].data[i].type,
          backgroundColor: chartType[type].data[i].bgcolor,
          borderColor: chartType[type].data[i].bgcolor,
          data: array.map(x=>x[chartType[type].data[i].data]),
          yAxisID: chartType[type].data[i].yId || 'y'
        }
      )
    }
    setDataSet({data: tempConfig.data, options: tempConfig.options})
  }
}
