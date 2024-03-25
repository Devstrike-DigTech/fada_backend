import axios, { AxiosInstance } from 'axios';
import { RegexValidators } from './lib/RegexValidators';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class API {
  public static BaseUrl: string;
  public static API: AxiosInstance = axios.create({
    baseURL: API.BaseUrl,
    withCredentials: false,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  public static getAPI(url: string) {
    //Not sure but for reference purposes - this might cause some damage in that its only one instance used throught the application.
    //verify that url is of url format
    if (!RegexValidators.URL(url)) {
      //log exception to logger
      throw new InternalServerErrorException();
    }
    API.API.defaults.baseURL = url;
    return API.API;
  }
}
