import { Injectable } from "@angular/core";
import { Http, Headers} from "@angular/http";


@Injectable()
export class AuthService{
  redirectUrl:string = "http://127.0.0.1:3000/login";

  secret: string = "web_client_secret";
  client: string = "web_client"

  baseUrl = "https://"+this.client+":"+this.secret+"@auth.wiklosoft.com";

  loginUrl: string = "https://auth.wiklosoft.com/web/authorize?client_id=web_client&login_redirect_uri=%2Fweb%2Fauthorize&redirect_uri=http://127.0.0.1:3000/login&response_type=token&scope=read";
 
  token: string;

  constructor(private http: Http){

  }

  login(){
    window.location.href = this.loginUrl; 
  }

  setToken(token:string){
    this.token = token;
  }
}