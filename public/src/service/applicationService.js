import axios from "axios";

export async function getApplicationDetail(applicationId) {
  
  try {
    let res = await axios({
      url: `/application/${applicationId}`,
      method: "get",
      timeout: 8000,
    });
    // if (res.status === 200) {
    //   console.log(res.status);
    // }
    return res.data;
  } catch (err) {
     return err
  }
}
