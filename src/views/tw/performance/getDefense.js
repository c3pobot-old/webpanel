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
export default function GetDefense(opts = {}, data = [], date, chartType = 'Home Defense'){
  const { setDataSet } = opts
  let type = 'homeDefense'
  if(chartType === 'Away Defense') type = 'awayDefense'
  let tempData = data.find(x=>x.date === date)
  if(tempData?.chartDefense[type]?.length > 0){
    let tempConfig = JSON.parse(JSON.stringify(config))
    tempData.chartDefense[type].sort((a, b)=>{
      return b.total - a.total
    })
    tempConfig.data.labels = tempData.chartDefense[type].map(x=>x.name)
    tempConfig.options.plugins.title.text = date+' '+(type === 'homeDefense' ? 'Home':'Away')+' Defense'
    tempConfig.data.datasets.push(
      {
        label: 'Total Squads',
        type: 'bar',
        backgroundColor: '#0000FF',
        borderColor: '#0000FF',
        data: tempData.chartDefense[type].map(x=>+x.total)
      }
    )
    tempConfig.data.datasets.push(
      {
        label: 'Extra Battles',
        type: 'bar',
        backgroundColor: '#FFA500',
        borderColor: '#FFA500',
        data: tempData.chartDefense[type].map(x=>+x.diff)
      }
    )
    setDataSet(tempConfig)
  }
}
