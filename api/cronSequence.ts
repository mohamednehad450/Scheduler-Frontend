import axios from "axios";
import { Cron, Sequence } from "../components/common";

class CronSequence {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  linkCron = (id: Cron["id"], sequencesIds: Sequence["id"][], token: string) =>
    axios.post<Cron>(this.url + "/cron/" + id, sequencesIds, {
      params: { token },
    });

  linkSequence = (id: Sequence["id"], cronsIds: Cron["id"][], token: string) =>
    axios.post<Sequence>(this.url + "/sequence/" + id, cronsIds, {
      params: { token },
    });
}

export default CronSequence;
