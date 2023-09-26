import { useNavigate, useParams } from "react-router-dom";
import { OccupationShow } from "./OccupationShow";
import { useContext, useEffect, useState } from "react";
import { getSCBStatisticsSalary } from "../services/getSCBStatisticsServices";
import { ISCBData } from "../models/IGetSCBStatisticsSalary";
import { useOutletData } from "../context/useOutletData";
import { SSYKdataContext } from "../context/SSYKdataContext";
import { useSSYKDetails } from "../hooks/useSSYKDetails";
import { ForecastContext } from "../context/ForecastContext";
import {
  checkDeficiencyValues,
  findDeficiencyValues,
} from "../functions/forecastDataFunction";

export const Occupation = () => {
  const ssykdata = useContext(SSYKdataContext);
  const { searchData } = useOutletData();
  const forecastData = useContext(ForecastContext);

  const conceptTaxonomyId = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chartLineXValues, setChartLineXValues] = useState<string[]>([]);
  const [chartLineYValues, setChartLineYValues] = useState<number[]>([]);

  const occupationFound = searchData?.related_occupations.find(
    (occupation) => occupation.concept_taxonomy_id === conceptTaxonomyId.id
  );

  const ssykToMatch = occupationFound?.occupation_group.ssyk || "";
  const findIndexText = useSSYKDetails(ssykToMatch, ssykdata) || "";

  useEffect(() => {
    if (occupationFound) {
      const ssyk = occupationFound.occupation_group.ssyk;

      const getDataSCB = async () => {
        const chartLineData = await getSCBStatisticsSalary(ssyk);
        if (chartLineData) {
          getValuesArray(chartLineData);
        }
      };
      if (chartLineXValues.length === 0) {
        getDataSCB();
      }
    }
  });

  // useEffect(() => {
  //   if (!forecastData) return;
  //   const getForecast = () => {
  //     if (forecastData) {
  //       findDeficiencyValues(forecastData, ssykToMatch);
  //     } else {
  //       console.log("oops, something went wrong. Please try again.");
  //     }
  //   };
  //   if (forecastData) {
  //     getForecast();
  //   }
  // });

  const getValuesArray = (chartLineData: ISCBData[]) => {
    if (chartLineData) {
      const chartLineXValues = chartLineData.map((item) => item.key[1]).flat();
      const chartLineYValues = chartLineData.map((item) => item.values).flat();
      const chartLineYValuesToNumbers = chartLineYValues.map(
        (chartLineStringValue) => {
          return parseInt(chartLineStringValue);
        }
      );
      setChartLineXValues(chartLineXValues);
      setChartLineYValues(chartLineYValuesToNumbers);
    } else {
      console.log("no data found");
    }
  };

  const findDeficiencyValuesResult = findDeficiencyValues(
    forecastData,
    ssykToMatch
  );

  const deficiencyValueData2023 = checkDeficiencyValues(
    Number(findDeficiencyValuesResult.deficiencyValue2023?.bristvarde)
  );
  const deficiencyValueData2026 = checkDeficiencyValues(
    Number(findDeficiencyValuesResult.deficiencyValue2026?.bristvarde)
  );
  console.log(deficiencyValueData2023, deficiencyValueData2026);

  const handleReturnButton = () => {
    navigate("/sok-yrke");
  };

  return (
    <>
      <div>
        <OccupationShow
          findIndexText={findIndexText}
          occupationFound={occupationFound}
          chartLineYValues={chartLineYValues}
          chartLineXValues={chartLineXValues}
          handleReturnButton={handleReturnButton}
          deficiencyValueData2023={deficiencyValueData2023}
          deficiencyValueData2026={deficiencyValueData2026}
        ></OccupationShow>
      </div>
    </>
  );
};
