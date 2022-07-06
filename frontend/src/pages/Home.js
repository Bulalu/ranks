import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
import axios from "axios";
import {} from 'dotenv/config'



const Home = () => {
  
  const { Moralis, isInitialized } = useMoralis();
 
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  
  const [file, setFile] = useState()
  const [myipfsHash, setIPFSHASH] = useState()
 
 
  
  const handleFile=async (inputData) =>{

    console.log('starting')

    // initialize the form data
    const json_data = JSON.stringify(inputData)
    console.log("json stringfied", json_data)

    // call the keys from .env
    const API_KEY = process.env.REACT_APP_API_KEY
    const API_SECRET = process.env.REACT_APP_API_SECRET

    // the endpoint needed to upload the file
    const url =  `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    const response = await axios.post(
      url,
      json_data,
      {
          headers: {
              "Content-Type": 'application/json', 
              'pinata_api_key': API_KEY,
              'pinata_secret_api_key': API_SECRET

          }
      }
  )

    console.log("logging resposne", response)
    // console.log("I am the hash", response.data.IpfsHash)

    // get the hash
     setIPFSHASH(response.data.IpfsHash)

    
    
    
  }


  async function fetchYoutubeData(yt_link) {
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    
    let url = "https://www.googleapis.com/youtube/v3/videos?key=" + process.env.REACT_APP_YOUTUBE_API_KEY +"&part=snippet&id=" + yt_link.match(re)[7]
    const response = await axios.get(url)
    const data_ = await response.data
    return {
            "id": data_.items[0]?.id,
            "title": data_.items[0]?.snippet?.title,
            "published":data_.items[0]?.snippet?.publishedAt,
            "image":data_.items[0]?.snippet?.thumbnails?.high?.url,
            "yt_link": yt_link
    }
    
}
 
  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
           
          <Tab tabKey={1} tabName="MUSIC">
          <div className="tabContent" >

          <Form
             buttonConfig={{
              onClick: function noRefCheck(){},
              theme: 'primary'
            }}
            data={[
              
              {
                inputWidth: '100%',
                name: 'youtube link',
                type: 'text',
                validation: {
                  regExp: '^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$',
                  required: true,
                  regExpInvalidMessage: 'please put a valid YOUTUBE link ffs!'
                },
                value: ''
              }
            ]}

            onSubmit={ async (e) => {
              
              let res =  await  fetchYoutubeData(e.data[0].inputResult).then( data => {return data})
              handleFile(res)
             
             
              console.log(res)
              console.log("IPFS VAriable",myipfsHash)
             

              console.log(`https://gateway.pinata.cloud/ipfs/${myipfsHash}`)
            }}
            title="Drop a hit anon!"
          
          /> 
            <div className="giphy">
            <img width="250px"  src="https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif" alt="Ninja donut gif" /> 
            <h1> here is your cid {myipfsHash}</h1>
            <a href={`https://gateway.pinata.cloud/ipfs/${myipfsHash}`}> your cid</a>
            </div>
            
 
          </div>
          
          
            
 
          </Tab>

          <Tab tabKey={2} tabName="BOARD">
            {/* {proposals && (
            <div className="tabContent">
              Governance Overview
              <div className="widgets">
                <Widget
                  info={totalP}
                  title="Proposals Created"
                  style={{ width: "200%" }}
                >
                  <div className="extraWidgetInfo">
                    <div className="extraTitle">Pass Rate</div>
                    <div className="progress">
                      <div
                        className="progressPercentage"
                        style={{ width: `${passRate}%` }}
                      ></div>
                    </div>
                  </div>
                </Widget>
                <Widget info={voters.length} title="Eligible Voters" />
                <Widget info={totalP-counted} title="Ongoing Proposals" />
              </div>
              Recent Proposals
              <div style={{ marginTop: "30px" }}>
                <Table
                  columnsConfig="10% 70% 20%"
                  data={proposals}
                  header={[
                    <span>ID</span>,
                    <span>Description</span>,
                    <span>Status</span>,
                  ]}
                  pageSize={5}
                />
              </div>

              <Form
                  buttonConfig={{
                    isLoading: sub,
                    loadingText: "Submitting Proposal",
                    text: "Submit",
                    theme: "secondary",
                  }}
                  data={[
                    {
                      inputWidth: "100%",
                      name: "New Proposal",
                      type: "textarea",
                      validation: {
                        required: true,
                      },
                      value: "",
                    },
                  ]}
                  onSubmit={(e) => {
                    setSub(true);
                    createProposal(e.data[0].inputResult);
                  }}
                  title="Create a New Proposal"
                />


            </div>
            )} */}
          </Tab>
          
        </TabList>
      </div>
      {/* <div className="voting"></div> */}
    </>
  );
};

export default Home;
