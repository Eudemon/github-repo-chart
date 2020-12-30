import React, { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"

export default function Graph({ chart }) {
  const [data, setData] = useState()

  useEffect(() => {
    let labels = [],
      d = []
    for (let lang in chart) {
      labels.push(lang)
      d.push(chart[lang])
    }

    setData({
      labels: labels,
      datasets: [
        {
          label: "Languages",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: d,
        },
      ],
    })
  }, [chart])

  return <>{data ? <Bar data={data} /> : null}</>
}
