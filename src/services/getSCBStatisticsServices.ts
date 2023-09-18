import axios from "axios";
import { IGetSCBStatisticsSalary, IGetSCBStatisticsSalaryResponse } from "../models/IGetSCBStatisticsSalary";


const URL = 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0110/AM0110A/LonYrkeRegion4A';
const SSYKcode = "2512";
const REQUESTBODY: IGetSCBStatisticsSalary = {

  "query": [
    {
      "code": "Yrke2012",
      "selection": {
        "filter": "item",
        "values": [
          SSYKcode
        ]
      }
    },
    {
      "code": "ContentsCode",
      "selection": {
        "filter": "item",
        "values": [
          "000000BW"
        ]
      }
    },
    {
      "code": "Tid",
      "selection": {
        "filter": "item",
        "values": [
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
          "2022"
        ]
      }
    }
  ],
  "response": {
    "format": "json"
  }

}

export const getSCBStatisticsSalary = async () => {
  try {
    // const response = await axios.get<IGetSCBStatisticsSalaryResponse>(URL);
    const response = await axios.post<IGetSCBStatisticsSalaryResponse>(URL, REQUESTBODY); //Cross-Origin Error
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error', error)
  }
}

export const getSCBStatistics = async () => {
  try {
    // const response = await axios.get<IGetSCBStatisticsSalaryResponse>(URL);
    const response = await axios.get(URL); //Cross-Origin Error
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error', error)
  }
}

