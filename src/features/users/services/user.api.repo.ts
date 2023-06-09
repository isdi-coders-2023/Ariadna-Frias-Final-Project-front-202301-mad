import Swal from "sweetalert2";
import { ServerResp, User } from "../models/user";

export class UserApiRepo {
  url: string;
  constructor() {
    this.url = "https://final-project-festivapp.onrender.com/users";
  }

  async register(user: Partial<User>): Promise<ServerResp> {
    const resp = await fetch(this.url + "/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json",
      },
    });
    Swal.fire("User correctly registered!");
    if (!resp.ok)
      throw new Error("Error Http: " + resp.status + ". " + resp.statusText);
    const data = await resp.json();
    return data;
  }

  async login(user: Partial<User>): Promise<ServerResp> {
    const resp = await fetch(this.url + "/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json",
      },
    });
    Swal.fire("Successful logging!");
    if (!resp.ok) {
      Swal.fire("Sorry, incorrect data");
      throw new Error("Error Http: " + resp.status + ". " + resp.statusText);
    }
    const data = await resp.json();
    if (data.token) JSON.stringify(localStorage.setItem("token", data.token));
    return data;
  }
}
