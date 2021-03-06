import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { ParamService } from '../service/param-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lang-check',
  templateUrl: './lang-check.component.html',
  styleUrls: ['./lang-check.component.css']
})
export class LangCheckComponent implements OnInit {
  public inputText1 = '';
  public inputText2 = '';
  public inputText3 = '';
  public showResult1 = '';
  public feedback = '';
  private sampleSen = '';
  private markObjSen = '';

  constructor(protected http: HttpClient, protected router: Router,protected paramSrv: ParamService) { }

  ngOnInit(): void {
    console.log('Start LangCheckComponent');
  }

  public async ckStrategy1(){
    if(await this.cheSentence(this.inputText1)){
      this.showResult1 = 'OK';
    } else {
      this.showResult1 = 'NG';
    }
    use.load().then(model => {
      const sentences = [
        'Hello.',
        'How are you?'
      ];
      model.embed(sentences).then(embeddings => {
        embeddings.print(true /* verbose */);
        console.log('*********************');
        console.log(embeddings);

        let cosine_similarity_matrix = this.cosine_similarity_matrix(embeddings.arraySync());
        console.log(cosine_similarity_matrix);
      });
    });

    

    // const model = tf.sequential();
    // model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    // model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
    // model.fit(xs, ys, {epochs: 10}).then(() => {
    //   console.log(model.predict(tf.tensor2d([5], [1, 1])).toString());
    // });
  }

  public async ckStrategy2(){
    this.paramSrv.sharedData = this.inputText2;
    //this.router.navigate(['/sub-page1',{ id: 'heroId' }]);
    this.router.navigate(['/sub-page1',{p1: this.inputText3}]);
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
              rtStr += '???' + errlist[i].message + '<br>';
            }
        }
      }
    }
    return rtStr;
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
