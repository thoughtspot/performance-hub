import React, { useState, useEffect } from "react"
import { currencyFormatter } from "../util/Util"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function CustomersTab(props: {tsURL: string; TSRestFilter: any }){
    const {
        tsURL,
        TSRestFilter
    } = props
    const [data,setData] = useState('')
    useEffect(() => {
        var url = tsURL+"/api/rest/2.0/metadata/answer/data"
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
            body: JSON.stringify({
                "metadata_identifier": "ca0c7c41-a552-4775-ab96-e70a447c19ef",
                "record_offset": 0,
                "record_size": 10,
                "runtime_filter":TSRestFilter
            })
        })
        .then(response => response.json()).then(
            data => {
                setData(data.contents[0].data_rows)
        })
    },[TSRestFilter])
    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-2/3">
            <div className="flex flex-col h-24 align-start justify-center pl-10">
                <div className="flex text-3xl font-bold pt-5">
                    {data ? Number(data[0][0]) : null}
                </div>
                <div className="flex">
                Customers
                </div>
            </div>
            <div className="flex flex-row pl-8 w-full h-8">
                <div className="flex flex-row mr-2 pt-3 align-center w-48">
                    <div className="w-0.5 rounded-md"></div>
                    <div className="pl-1 font-bold text-lg">
                        {data ? Math.round(Number(data[0][1])*10)/10  : null}
                    </div>
                    <div className="pl-1 text-lg flex">
                        Average Spend
                    </div>
                </div>
                <div className="flex flex-row mr-2 pt-3 align-center">
                    <div className="flex align-center">
                        <div className="rounded-md w-0.5"></div>
                        <div className="pl-1 font-bold text-lg">
                            {data ? Math.round(Number(data[0][2])*10)/10 : null}
                        </div>
                        <div className="pl-1 text-lg">
                            Average # of Items
                        </div>
                    </div>
                </div>
            </div>
            </div>
            {/*
            <div className="flex w-2/3 h-32">
             <HighchartsReact highcharts={Highcharts} options={{
    chart: {
        type: 'area'
    },
    accessibility: {
        description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
    },
    title: null,
    subtitle: null,
    xAxis: {
        title: null,
        visible: false,
        allowDecimals: false,
        accessibility: {
            rangeDescription: 'Range: 1940 to 201'
        }
    },
    legend: {enabled:false},
    yAxis: {
        visible: false,
        title: null
    },
    tooltip: {
        pointFormat:'{point.y}' //'{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },
    plotOptions: {
        area: {
            pointStart: 1940,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{
        name: 'USA',
        color: '#FD5C5E',
        data: [
            null, null, null, null, null, 2, 9, 13, 50, 170, 299, 438, 841,
            1169, 1703, 2422, 3692, 5543, 7345, 12298, 18638, 22229, 25540,
            28133, 29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830,
            26516, 27835, 28537, 27519, 25914, 25542, 24418, 24138, 24104,
            23208, 22886, 23305, 23459, 23368, 23317, 23575, 23205, 22217,
            21392, 19008, 13708, 11511, 10979, 10904, 11011, 10903, 10732,
            10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273,
            5113, 5066, 4897, 4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805,
            3750, 3708, 3708
        ]
    }]
}} /> 
            </div>*/}
        </div>
    )
}


