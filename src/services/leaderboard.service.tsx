/* eslint-disable no-throw-literal */
import { useRecoilState } from "recoil";
import services, { HandleError } from ".";
import { tenantNameState } from "../atoms/globalStates";
import api from "../commons/constants/api.constant";
import { LeaderBoardData } from "../models/leaderboard.model";
import utils from "../utils";

const getList = async (tenant?: string, data?: LeaderBoardData) => {
  try {
    console.log({tenant})
    const rs = await services.get(
      `/gateway/${tenant}/user/leaderboard?${utils.objectToQuery(data)}`
    );
    console.log("Inside the leaderboard service \n", rs.data);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const leaderBoardService = {
  getList,
};
export default leaderBoardService;
