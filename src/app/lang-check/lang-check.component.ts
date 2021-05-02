import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-lang-check',
  templateUrl: './lang-check.component.html',
  styleUrls: ['./lang-check.component.css']
})
export class LangCheckComponent implements OnInit {
  public inputText1 = '';
  public showResult1 = '';

  constructor(protected http: HttpClient) { }

  ngOnInit(): void {
    console.log('Start LangCheckComponent');
  }

  public async ckStrategy1(){
    if(await this.cheSentence(this.inputText1)){
      this.showResult1 = 'OK';
    } else {
      this.showResult1 = 'NG';
    }
  }

  private async cheSentence(mytext: string): Promise<boolean>{
    let url = 'https://languagetool.org/api/v2/check';
    let body = new HttpParams();
    body = body.set('text',mytext);
    body = body.set('language','en-US');
    body = body.set('disableRules','UPPERCASE_SENTENCE_START');
    body = body.set('enabledOnly','false');
    let result: any;
    let myheaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'});

    await this.http.post(url, body, {headers: myheaders})
          .toPromise().then(resp=>{
              result = resp;
              console.log(result);
    });
    console.log(result.matches);
    if(result.matches.length !== 0){
      return false;
    }
    return true;
  }
}
