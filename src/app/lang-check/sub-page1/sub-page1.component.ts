import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ParamService } from '../../service/param-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RemarkObject } from '../../model/mark-object';
import * as use from '@tensorflow-models/universal-sentence-encoder';

@Component({
  selector: 'app-sub-page1',
  templateUrl: './sub-page1.component.html',
  styleUrls: ['./sub-page1.component.css']
})
export class SubPage1Component implements OnInit {
  public inputText1 = '';
  public inputText2 = '';
  public showResult1 = '';
  public feedback = '';
  public arrSentences: Array<string>;
  public arrRemarkObj: Array<RemarkObject>;
  public outputText1 = '';

  constructor(protected http: HttpClient,private route: ActivatedRoute,
    protected paramSrv: ParamService) { }

  async ngOnInit() {
    console.log('Start SubPage1Component');
    // alert(this.paramSrv.sharedData);
    //alert(this.route.snapshot.paramMap.get('id'));
    let str1: string = this.paramSrv.sharedData;
    let str2: string = this.route.snapshot.paramMap.get('p1');
    this.arrSentences = str1.split('\n');

    this.arrRemarkObj = new Array<RemarkObject>();
    for(let i=0; i < this.arrSentences.length; i++){
      if(this.arrSentences[i]){
        let rkObj = new RemarkObject();
        rkObj.content = this.arrSentences[i];
        rkObj.grammarChk = await this.cheSentence(rkObj.content);
        rkObj.similarity = parseFloat(await this.chkSimilarity(rkObj.content,str2)).toFixed(2);
        this.outputText1 += rkObj.content + ' : ' + this.ckStrategy1(rkObj.grammarChk,rkObj.similarity) 
                            + ' (' + rkObj.grammarChk + '|' + rkObj.similarity + ')' + '\n';
        this.arrRemarkObj.push(rkObj);
      }
    }
  }

  public ckStrategy1(p1:boolean,p2:string){
    if(p1){
      let fl = parseFloat(p2);
      if(!isNaN(fl)){
        if(fl > 0.8){
          return 'OK';
        } else{
          return 'Judgement';
        }
      }
    }
    return 'NG'
  }

  private async cheSentence(mytext: string): Promise<boolean>{
    let url = 'https://languagetool.org/api/v2/check';
    let body = new HttpParams();
    body = body.set('text',mytext);
    body = body.set('language','en-US');
    body = body.set('disableRules','UPPERCASE_SENTENCE_START');
    body = body.set('enabledOnly','false');
    let myheaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'});
    let result: any;
    await this.http.post(url, body, {headers: myheaders})
          .toPromise().then(resp=>{
            result = resp;
    });
    console.log(result.matches);
    this.feedback = this.showErrorMsgs(result.matches);
    if(result.matches.length !== 0){
      return false;
    }
    return true;
  }

  private showErrorMsgs(errlist: any): string {
    let rtStr = '';
    if(errlist){
      if(errlist.length){
        if(errlist.length > 0){
            for(let i=0; i < errlist.length; i++ ){
              rtStr += '●' + errlist[i].message + '<br>';
            }
        }
      }
    }
    return rtStr;
  }

  private async chkSimilarity(p1:string,p2:string){
    let cosine_similarity_matrix;
    await use.load().then(async (model) => {
      const sentences = [
        p1,
        p2
      ];
      await model.embed(sentences).then(embeddings => {
        embeddings.print(true /* verbose */);
        console.log('*********************');
        console.log(embeddings);

        cosine_similarity_matrix = this.cosine_similarity_matrix(embeddings.arraySync());
        console.log(cosine_similarity_matrix);
      });
    });

    return cosine_similarity_matrix[0][1];
  }

  private dot(a:any, b:any){
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var sum = 0;
    for (var key in a) {
      if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
        sum += a[key] * b[key]
      }
    }
    return sum
  }

  private similarity(a:any, b:any) {
    var magnitudeA = Math.sqrt(this.dot(a, a));
    var magnitudeB = Math.sqrt(this.dot(b, b));
    if (magnitudeA && magnitudeB)
      return this.dot(a, b) / (magnitudeA * magnitudeB);
    else return false
  }

  private cosine_similarity_matrix(matrix:any){
    let cosine_similarity_matrix = [];
    for(let i=0;i<matrix.length;i++){
      let row = [];
      for(let j=0;j<i;j++){
        row.push(cosine_similarity_matrix[j][i]);
      }
      row.push(1);
      for(let j=(i+1);j<matrix.length;j++){
        row.push(this.similarity(matrix[i],matrix[j]));
      }
      cosine_similarity_matrix.push(row);
    }
    return cosine_similarity_matrix;
  }
}
