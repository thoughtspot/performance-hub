import { useEffect, useRef, useState } from "react"
//@ts-ignore
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import { currencyFormatter } from "../util/Util"

interface StoreDetailProps{
    tsURL:string,
    selectedStore:string
}
export const StoreDetails = ({tsURL,selectedStore}:StoreDetailProps) => {
    mapboxgl.accessToken = "pk.eyJ1IjoibnNjaHJvZWRlciIsImEiOiJjajRlb3lheGIwNjNvMnFydnV0NTluZXB3In0.8WPeeEJ_7ys1RT_gFeEN2w"
    const [data, setData] = useState<any[]>([])
    const mapContainer = useRef(null);
    const map = useRef(null);

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
                "metadata_identifier": "820f9be6-0218-4acc-bc01-369c1c7ada05",
                "record_offset": 0,
                "record_size": 10,
                "runtime_filter":{
                    'col1':'Store Name',
                    'op1':'EQ',
                    'val1':selectedStore
                }
            })
        })
        .then(response => response.json()).then(
            data => {
                let newData = data.contents[0].data_rows
                console.log(newData)
                if (newData.length == 0) return;
                setData(data.contents[0].data_rows)
                if (map.current) return; // initialize map only once
                map.current = new mapboxgl.Map({
                  container: mapContainer.current,
                  style: 'mapbox://styles/mapbox/streets-v12',
                  innerHeight:'600px',
                  outerHeight: '600px',
                  center: [newData[0][10], newData[0][9]],
                  zoom: "10"
                })
                const marker1 = new mapboxgl.Marker()
                .setLngLat([newData[0][10], newData[0][9]])
                .addTo(map.current);

            
        })

    },[selectedStore])

    return (
        <div className="p-8 flex flex-col m-8 bg-white rounded-3xl shadow-sm shadow-slate-100">

            {data && data.length>0 && data[0].length>0 && (
                <div className="flex flex-col mb-8">
                    <div className="flex text-3xl align-start font-bold ">
                        <div>{data[0][0]}  </div>  
                    </div>
                    <div>{data[0][4]} {data[0][5]}, {data[0][6]}</div>
                    <div>{data[0][2]} Region</div>
                    <div className="flex text-2xl align-start font-bold mt-8 mb-4">
                        At a Glance
                    </div>
                    <table>
                        <thead className="h-12">
                        <th>Sales</th>
                        <th>Gross Profit ($)</th>
                        <th>Gross Profit (%)</th>
                        <th># of Customers</th>
                        <th># of Employees</th>
                        <th># of Transactions</th>
                        <th>Space Rent Cost</th>
                        <th>Foot Traffic</th>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td>{currencyFormatter.format(data[0][7])}</td>
                                <td>{currencyFormatter.format(data[0][11])}</td>
                                <td>{Math.round(data[0][12] * 1000) / 10}%</td>
                                <td>{data[0][13]}</td>
                                <td>{data[0][14]}</td>
                                <td>{data[0][15]}</td>
                                <td>{currencyFormatter.format(data[0][16])}</td>
                                <td>{data[0][8]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            )}
            <div style={{width:'100%',height:'500px'}} ref={mapContainer} className="map-container" />
            {data && data.length>0 && data[0].length>0 && (

                
            <div className="my-8">
                <div className="flex text-2xl align-start font-bold mb-4">Manage</div>
                <div className="flex text-lg mt-4 mb-4 text-lg font-bold">Available Campaigns</div>
                <div className="flex flex-row justify-between">
                    <CampaignButton store={data[0][0]} name="Spicy Snack Wednesday" />
                    <CampaignButton store={data[0][0]} name="My Favorite Store" />
                    <CampaignButton store={data[0][0]} name="2024 Display Banner" />
                </div>
                <div className="flex text-lg mt-8 mb-4 text-lg font-bold">Internal Notes</div>
                <textarea className="w-full h-96 bg-slate-100" value={"Type here to add notes to the store"}>
                </textarea>
            </div>
            )}
        </div>
    )

}
interface CampaignButtonProps{
    name:string,
    store:string
}
const CampaignButton = ({name,store}:CampaignButtonProps)=>{
    const [popupVisible, setPopupVisible] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [success, setSuccess] = useState(false)
    function toggleAdd(){
        if (success){
            setPopupVisible(false)
        }else{
            setInProgress(true)
            setTimeout(()=>{
                setSuccess(true)
                setInProgress(false)
            },1500)
        }
    }
    let buttonClass = success  ? "bg-green-400 hover:bg-green-300" : "bg-slate-400 hover:bg-slate-300"
    let buttonText = "Add Campaign"
    if (success) buttonText = "Done!"
    if (inProgress) buttonText = "Adding ..."
    return (
        <>
        {popupVisible && (
            <div style={{width:400, position:'absolute', top:'calc(50% - 200px)', left:'calc(50% - 200px)'}} className="p-8 flex flex-col bg-white shadow-2xl items-center">
                <div>This will begin a new campaign</div>
                <div className="my-2 font-bold text-xl">{name}</div>
                <div className="mt-4">For the selected store</div>
                <div className="my-2 font-bold text-xl">{store}</div>
                <div onClick={toggleAdd} className={buttonClass + " mt-8 flex w-full rounded-md p-4 items-center justify-center align-center hover:cursor-pointer hover:bg-slate-300"}>
                    {buttonText}
                </div>
            </div>
        )}
    <div onClick={()=>{
        setSuccess(false)
        setPopupVisible(true)
        }} style={{width:'300px'}} className="flex rounded-md p-4 bg-slate-400 items-center justify-center align-center hover:cursor-pointer hover:bg-slate-300">
        {name}
    </div>
    </>
    )
}