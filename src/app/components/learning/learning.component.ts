import { Component, OnInit} from '@angular/core';
import { element } from 'protractor';

//models
import { Options } from "../../models/options";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  

  options:Options={
      audio:{
        initialVoice:'',
        separationSing:'=',
        endVoice:'',
        initialVoiceSound:'',
        endVoiceSound:'',
        repeatforRow:1,
        speakLowPerRow:false,
        //speechRate:[1,0.6,0.5,0.4]
        speechRate:{
          0:[1],
          1:[1,0.4],
          2:[1,0.5,0.4],
          3:[1,0.6,0.5,0.4]
        }

      },
      video:{
          rowNumber:7
      },
      text:'',
      showWordRead:{
        showWords:true,
        onlyLine:false
      },
      start:false,
      onlyRead:{
        enabled:false
      },
      style:{
        imgBackground:'',
        fontSize:''
    }
  };

  apiVoice:any;
  apiJarvis:any;

  arrayVoices={
    lang:[],
    voice:[]
  };
  soundVoices={
    initial:[],
    end:[]
  };
  /*exampleSounds={
    moi:[',ok']
  };*/
  text:any;
  test:any;
  endSpeak=false;

  //by text read
  row=0;
  column=0;
  repeat=0;
  rateIndex=0;
  paintingText:any;
  idNumberWordScreen=0;
  mathRow=[0,0];

  //Read indicator
  newArrayText=[];

  //btn-botons
  idNumberImg:0;


  //to record
  body=document.body;

//  p=[{0:['house','casa','car']},{1:['red','rojo']}]

  constructor() { }

  ngOnInit(): void {
    //console.log(this.options);
    this.init();
    
    //adapt text in record wimdow
    window.onresize=()=>{
     // this.adaptText();
    }
    //this.adaptText();
  };

  init(){
    // Comprobamos si tenemos soporte en nuestro navegador
    if (!SpeechSynthesisUtterance) {
    alert('SpeechSynthesisUtterance no soportado');
      return false; 
      //it not continue into down
    }
    
    // Interface de la API
    this.apiVoice = new SpeechSynthesisUtterance();
    this.apiJarvis = window.speechSynthesis;
    
    setTimeout(() => {
      this.getVoices();

    }, 1000);
   // console.log(this.exampleSounds['moi']);

  }

  getVoices(){
    // we obtain all sopported voices
    const voices = this.apiJarvis.getVoices();
    //console.log(voices);
    
    let newArrayVoices=[];
    let language=[];
    voices.forEach(item => {
      const { name, lang } = item;
      //obtain lang
      newArrayVoices.push(`${item.name} / ${item.lang}`);
      language.push(`${item.name.split('-')[1] || item.name.split('-')[0] } / ${item.lang}`);
    });
    
    //to erase repeated voices
    this.arrayVoices.voice.push(...new Set(newArrayVoices));
    // to select Initial voice and end voice
    this.arrayVoices.lang.push(...new Set(language));

    //console.log(this.arrayVoices);
    
  }
  getSeparationSing(value:any){
    //console.log(value.target.value);

    //add the selected sing
    this.options.audio.separationSing=value.target.value;
    

  }

  //to select language of voice
  selectLanguage(values:any){
    const {name, value}=values.target;
    /*console.log(value);
    console.log(name);*/
    let orderVoice={
      initialSound:[],
      endSound:[]
    };

    //to show the selected voice in its language
    if(name == "InitialVoice"){
      this.arrayVoices.voice.forEach((item=>{
        if(item.split('/')[1] == value){         //with space there split(' / ')
          orderVoice.initialSound.push(item.split(' / ')[0]);
        }
      }));
      this.soundVoices.initial=orderVoice.initialSound;

      //add to the options the selected language of each voice
      this.options.audio.initialVoice= value;
      
    }else if(name == "endVoice"){
      this.arrayVoices.voice.forEach((item=>{
        if(item.split('/')[1] == value){
          orderVoice.endSound.push(item.split(' / ')[0]);
        }
      }));
      this.soundVoices.end=orderVoice.endSound;
      
      //add to the options the selected language of each voice
      this.options.audio.endVoice= value;
    };
    
  }

  selectVoice(values:any){
    const {name, value}=values.target;
    /*console.log(value);
    console.log(name);*/

    //add to the options the selected sound voice
    if(name == "initialSound"){
      this.options.audio.initialVoiceSound= value;
      
    }else if(name == "endSound"){
      this.options.audio.endVoiceSound=value;

    };
    this.changeLanguaje(value);
    this.pauseVoice();
    this.stopVoice();
    this.playVoice(value.split('-')[0]);
   // console.log(this.options);
   
  };
  repeatVoice(number){
    this.options.audio.repeatforRow=number;
  }
  rateSpeack(value){
    this.options.audio.speakLowPerRow=value.target.checked;
  }

  changeRate(value,index){
    if(this.options.audio.speakLowPerRow){
      this.apiVoice.rate=this.options.audio.speechRate[value][index];
    }else{//default
      this.apiVoice.rate=this.options.audio.speechRate[0][0];
    }
  }
  //test audio
  cancelTest(value){
    this.test = value;

    if(this.test){
      this.getText();
      this.readText();
      
    }else{
      this.stopVoice();
    }
  }
  mainRecord(value){
    this.options.start=value;

    //hidden it or show it
    let main_record = document.querySelector('.main-record');
    main_record.classList.add('true');

    if(!value){
      main_record.classList.remove('true');

      //add overflow to the body
      setTimeout(() => {
        this.body.classList.remove('hidde');
      }, 1);
      this.stopVoice();
    }
    
    //get text
    this.getText();

    //this.numberRowByWindow(0,this.options.video.rowNumber);
    //show all words to the begin
   this.preview(false);
    
  }
  //preview video
  preview(option){
    var mainRecord=document.querySelector('.main-record');
    var record=document.querySelector('.record');
    var btnRecord=document.querySelector('.btn-record');

    var choseed=option;

    if(option.target){
      choseed=option.target.checked;
    }
    if(choseed){
      record.setAttribute('style','overflow: hidden;font-size:'+this.options.style.fontSize+'px;');
      btnRecord.setAttribute('style','position: absolute;width: 100%;text-align: center;bottom: 0vh;display: none;');
    }else{
      btnRecord.setAttribute('style','position: absolute;width: 100%;text-align: center;bottom: 0vh;display: block;');
      record.setAttribute('style','height:'+(mainRecord.clientHeight-btnRecord.clientHeight)+'px;overflow: auto;top: 0px;position: absolute;font-size:'+this.options.style.fontSize+'px;');

    }
  }

  getText(){
    //erase old text
    this.options.text='';
    /*console.log(this.text);
    console.log("--------------------");
    console.log(encodeURIComponent(this.text));
    console.log("--------------------");
    console.log((this.text.match(/\n/g||[]).length));
    console.log("--------------------");
    console.log(this.text.split('\n'));*/

    //create json of text
    var textJSON={};
    //split it by line jum
    var splitText=this.text.split('\n');

    for(let i=0; i< splitText.length; i++){
      //split by "=" each word
      textJSON[i]=splitText[i].split(`${this.options.audio.separationSing}`);
      //textJSON[i]=splitText[i].split('=');

     /* for(let o =0; o<splitText[i].split('=').length; o++){
        textJSON[i].push(splitText[i].split('=')[o]);
      };*/
    }

    //added as new text format JSON 
    this.options.text=textJSON;
    //console.log(textJSON);
    

    if(this.options.text){
      //paint text on screen
      this.paintText();

      
    }
    
    
  };
  readText(){
    //mode video
    this.preview(true);

    console.clear();
    //console.log(this.options);
    

    this.mathRow =[0,0];
  
    //begin to read again
    this.column=0;
    this.row=0;
    this.repeat=0;
    this.rateIndex=this.options.audio.repeatforRow-1;
    this.endSpeak=false;
    this.idNumberWordScreen=0;
    //this.idNumberWordScreen=-1; // to two words by row
    //this.idNumberWordScreen=-2; //to one word by row

    this.pauseVoice();
    this.stopVoice();

    //start the events
    this.playVoice(' ');

    let text=this.options.text;
    
    this.apiVoice.onstart=()=>{   
      //Painted text
      this.paintingText=this.apiVoice.text;  

      //read row by row
      if(text[this.row] && this.column < text[this.row].length ){

        if(this.column % 2 == 0){
          this.changeLanguaje(this.options.audio.initialVoiceSound);
        }else{
          this.changeLanguaje(this.options.audio.endVoiceSound);
        }

        //speak more softly with each repeat
        this.changeRate(this.rateIndex,this.repeat);
        
        this.playVoice(text[this.row][this.column]);
        this.column++;
      
      }else{
        //end game
        this.endSpeak=true;  
        
      };
      
      //validate the length columns
      //to pass to the other row
      if(text[this.row] && this.column == text[this.row].length && Object.keys(text).length > this.row){
        console.log(555555555555555);

        this.paintingIndicator();
        this.column=0;
        //this.row++;

        this.repeat++;
        //repeat number
       // console.error(this.repeat+" === "+ this.options.audio.repeatforRow);
        //console.log(this.repeat+" ------ "+ this.options.audio.repeatforRow);
        
        if(this.repeat == this.options.audio.repeatforRow){
          //pass next row
          this.row++;
          this.repeat=0;

          //paint next words on screen
          this.idNumberWordScreen++;
  
          //console.error("nexts word");
          
          console.log(this.idNumberWordScreen +" ===== "+ this.options.video.rowNumber);
          //console.log('++++++++++ '+this.row);
          
         
        };

      };

      //this.paintingIndicator();
     // console.log('begins');


      //start to record
      if(!this.test){
        //this.startRecord();
        
      }
      
        
    }
    
    this.apiVoice.onboundary=(event)=>{
      
      let text= this.paintingText.substring(event.charLength+event.charIndex,event.charIndex);
      //console.log(text);
      var nu=event.elapsedTime;
      //console.error(nu+event.elapsedTime);
      
    };

    //end game
    this.apiVoice.onend=()=>{
      
      console.log("rnd");
      
      this.paintingScreem();

     if(this.endSpeak){
      
      this.preview(false);
      console.log("end");
      //this.cancelTest(false);
      //this.test=false;
      if(document.getElementById('btnStopTest')){
        document.getElementById('btnStopTest').click();
        
      };
      //end
      
      
     };
     
      
    };
    
  };
  paintingScreem(){
    let lenght=0;
    if(this.options.text[this.row]){
      lenght=this.options.text[this.row].lenght;
    }
    //validating word numbers from each column 
    if(this.idNumberWordScreen == this.options.video.rowNumber && this.column != 0 || lenght == 1){
      console.error("new screens painted");

      //i send it the number row            
      this.numberRowByWindow(this.idNumberWordScreen,this.row);
      this.idNumberWordScreen=0;
    // console.log(document.querySelectorAll('.text'));
     
    }

    //to show last row of words on screen
    let text5 =document.querySelectorAll('.text');
    if(!text5[this.row] && this.idNumberWordScreen != 0 || !text5[this.row] && this.options.video.rowNumber == 1){
      console.log("yes");
      //to prevent it from starting again
      if(this.idNumberWordScreen == 0){
        this.idNumberWordScreen++;
      }
      this.numberRowByWindow(this.idNumberWordScreen,this.row);
    }
  }
  paintText(){
    let styleText=`margin:15px; display: flex; align-items: center;`;
    let styleitem=`display: flex; justify-content: space-evenly;align-items: center; width: 100%;background-color: darkslategray;border-radius: 0px 17px 17px 0px;margin-left: 30px;padding: 1px;border: 2px solid;border-color:grey;`;
    let styleItemNumber=`padding: 5px; color: rgb(113, 141, 255);`;
    let styleItemNumberDiv=`display: flex;align-items: center;justify-content: center;width: 40px;height: 40px;background-color: darkslategrey;border-radius: 100%;position: absolute; border: 2px solid;border-color:grey;`;
    let styleItemWord=`color: rgb(153 173 255);`;
    let styleItemSecondWord=`color: rgb(251 255 164);`;




    //delete overflow to the body
    this.body.classList.add('hidde');

    let record =document.querySelector('.record');

    //Paint text window
    let textPainted=``;
    let textError=``;
    for(let i=0; i<Object.keys(this.options.text).length; i++){
      textError='';
      for(let o=2; o<this.options.text[i].length; o++){
        console.error(this.options.text[i][o]);
        textError+=`<span class="item-second-word" style="${styleItemSecondWord}">${this.options.text[i][o]}</span>`
        
      }
      let lastWord='';
      //if the word just is one
      if(this.options.text[i][1]){
        lastWord=this.options.text[i][1];
      };
      textPainted+=`<div class="text" style="${styleText}">
                      <div class="content-item-number" style="${styleItemNumberDiv}"><span class="item-number" style="${styleItemNumber}" >${i+1}</span></div>
                      <div class="item" style="${styleitem}">
                        <div class="item-word">
                          <span class="item-firt-word" style="${styleItemWord}">${this.options.text[i][0]}</span>
                        </div>
                        <div style="max-width: 10px; min-width: 10px;">
                          <span class="indicator-item hidden" style="color:red;" >${'>'}</span>
                        </div>
                        <div class="item-2" >
                          <span class="item-second-word" style="${styleItemSecondWord}">${lastWord}</span>
                          ${textError}
                        </div>
                      </div>
                    </div>`;
      
    }
    record.innerHTML=`<style>.hidden{display:none !important;}</style>`+textPainted;

   // console.log(record.children);    
    
  };

  startRecord(){
  
    
  };
  //play indicatior to each words
  paintingIndicator(){
    let text =document.querySelectorAll('.text');

    //hidde play icon
    if(text[this.row-1]){
      text[this.row-1].children.item(1).children.item(1).children.item(0).classList.add('hidden');
    };

    //show play icon
    if(text[this.row]){
      text[this.row].children.item(1).children.item(1).children.item(0).classList.remove('hidden');
    };
  };

  optionText(value){
    let styleText=` display: flex;justify-content: space-between; align-items: center;`;


    let mainRecord =document.querySelector('.main-record');
    let btnRecord =document.querySelector('.btn-record');
    let record =document.querySelector('.record');
    let text =document.querySelectorAll('.text');

    var {value, name}= value.target;
    if(name=="TextSize"){
      this.options.style.fontSize=value;
      var recordst=`overflow: auto;top: 0px;position: absolute;height:${mainRecord.clientHeight-btnRecord.clientHeight}px;font-size:${value}px;`;
      record.setAttribute('style',recordst);

    }else if(name=="columnSplit"){
      text.forEach(element => {
        element.children.item(1).children.item(1).setAttribute('style',`max-width: 100px; min-width: 100px; margin-right:${value*-3}px; margin-left:${value*-3}px;`);
      });
    }else if(name == "TextSplit"){
      text.forEach(element => {
        element.setAttribute('style',`${styleText}; margin:${value*0.8}px 0px;`);
      });
    }else if(name == "rowNumber"){
      this.options.video.rowNumber=value;
      //init the row to show
      this.numberRowByWindow(0,value);
    }
    
  }
  
  numberRowByWindow(begin,end){
   
    let text =document.querySelectorAll('.text');
    
    let rows=[];
    
     //validate secuenced
     if(begin == 0 ){
      
      //get the first words to show
      rows=Object.keys(this.options.text).slice(0,this.options.video.rowNumber);

    }else  {
      //after firts word and beyond
      if(this.mathRow[0] == 0 ){
        this.mathRow[0]=this.options.video.rowNumber;
        this.mathRow[1]=this.mathRow[0]*2;
      }else{
        this.mathRow[0]=this.mathRow[1];
        this.mathRow[1]=parseInt(this.mathRow[0].toString())+parseInt(this.options.video.rowNumber.toString());
      }
      //words to show
      rows=Object.keys(this.options.text).slice(this.mathRow[0],this.mathRow[1]);

    }

    //to show and to hide the row in the screen
    if(rows.length != 0 ){
      for(var i =0; i<text.length ; i++){
        text[i].classList.add('hidden');
        this.newArrayText=[];
        
      }
      rows.forEach((e,i)=>{
        text[e].classList.remove('hidden');
        //console.log(text[e]);

        //id to play indicator
        this.newArrayText.push(text[e])
        
      });
    }
        
  
    
  }
  adaptText(){
    let record =document.querySelector('.record');
    let divText =document.querySelectorAll('.text');
    
    for(var i=0; i<divText.length; i++){
      divText[i].setAttribute('style',`height:${record.clientHeight/divText.length}px`);
    }
  }

  playVoice(text:any){
    this.apiVoice.text=text;
    this.apiJarvis.speak(this.apiVoice);
  };

  stopVoice(){
    this.apiJarvis.cancel();
  };

  pauseVoice(){
    this.apiJarvis.resume();
  };

  changeLanguaje(nameVoice){
    //optain id voice
    var index=this.apiJarvis.getVoices().findIndex(function(voice){      
      return voice.name === nameVoice;
    });          
    if(index != -1){      
      this.apiVoice.voice=this.apiJarvis.getVoices()[index];
    };    
    //event onvoiceschanged
    this.apiJarvis.onvoiceschanged=this.changeLanguaje;
  }
   

  ///testing everything
  mm(){
    /*var g= document.querySelector(".InitialVoice");
    
    console.log(g);*/
    
  
  }

  ///style video
  PreviewImg(input, show){
    if(input.target.files && input.target.files[0]){
      var reader= new FileReader();
      reader.onload=function(e){
        document.getElementById(show).setAttribute('src',`${e.target.result}`);
    
      }
      reader.readAsDataURL(input.target.files[0]);

      this.options.style.imgBackground=input.target.files[0];
      //console.log(input.target.files[0]);
      
    }
  }

  imgSize(){
    var ImgBackground = document.getElementById('ImgBackground');
    this.idNumberImg++;
    
    //size img
    //full
    if(this.idNumberImg == 1){
      ImgBackground.setAttribute('style','height:100%; width:100%;position:fixed;z-index: -1;');
      //full height
    }else if(this.idNumberImg == 2){
      ImgBackground.setAttribute('style','height:100%;position:fixed;z-index: -1;');
      //full width
    }else if(this.idNumberImg == 3){
      ImgBackground.setAttribute('style','width:100%;position:fixed;z-index: -1;');
      //defect
    }else if(this.idNumberImg == 4) {
      ImgBackground.setAttribute('style',`position:fixed;z-index: -1;`);
      //original
    }else {
      ImgBackground.setAttribute('style',`height:${ImgBackground.offsetHeight}px; width:${ImgBackground.offsetWidth}px;position:fixed;z-index: -1;`);
      this.idNumberImg=0; 
    }
  }
  extract_style(name_clase, old_style, new_style){
    var element = document.querySelectorAll(`${'.'+name_clase}`);
    var style=[];

    //turn into 'style' to array            
    style=element[0].getAttribute('style').split(';');
    style=JSON.parse(JSON.stringify(style));
    
    var number_of_style=[];
    var number_of_newStyle=[];

    //if it have more than one style to edit
    number_of_style=old_style.split('_') || old_style;
    number_of_newStyle=new_style.split('_') || new_style;

    for(let i=0; i < number_of_style.length; i++){

      var index= style.findIndex(function(name_style){
        var name=name_style.split(':');
        // not empty space
        return  name[0].replace(/ /g,'') === number_of_style[i];
      });
      if(index != -1){
        //edit old style
        style.splice(index,1,`${number_of_style[i]+':'+number_of_newStyle[i]}`);
      }else{
        console.error('not found');
      };
      
    };

    //console.log(style);
    var newStyle=style.join(';');

    return newStyle;
  };

  colorWords(color,option){
    const colors = color.target;
    var item = document.querySelectorAll('.item');
    var item_number = document.querySelectorAll('.content-item-number');

    var item_firt_word = document.querySelectorAll('.item-firt-word');
    var item_second_word = document.querySelectorAll('.item-second-word');
    var numberIten = document.querySelectorAll('.item-number');


    
  
    switch(option){
      case 0:
        //font color right
        var newstyle=this.extract_style('item-firt-word','color',colors.value);          

        item_firt_word.forEach((element)=>{
            element.setAttribute('style',newstyle);            
        });
        break;
      case 1:
        //font color left
        var newstyle=this.extract_style('item-second-word','color',colors.value);
          

        item_second_word.forEach((element)=>{
            element.setAttribute('style',newstyle);            
        });
        break;
      case 2:
          //background color
          var newstyle=this.extract_style('item','background-color_border-color',colors.checked?'none_transparent':'darkslategray_grey');
          var newstyleNumber=this.extract_style('content-item-number','background-color_border-color',colors.checked?'none_transparent':'darkslategray_grey');
          

          item.forEach((element,id)=>{
            element.setAttribute('style',newstyle);            
            item_number[id].setAttribute('style',newstyleNumber);
          });
        break;
      case 3:
        //border color
        var newstyle=this.extract_style('item','border-color',colors.value);
        var newstyleNumber=this.extract_style('content-item-number','border-color',colors.value);

        item.forEach((element,id)=>{
          element.setAttribute('style',newstyle);
          item_number[id].setAttribute('style',newstyleNumber);
        });
        break;
      case 4:
        //inner color 
        //console.log(colors.value);
        var newstyle=this.extract_style('item','background-color',colors.value);
        var newstyleNumber=this.extract_style('content-item-number','background-color',colors.value);

        item.forEach((element,id)=>{
          element.setAttribute('style',newstyle);
          item_number[id].setAttribute('style',newstyleNumber);
        });
        break;
      case 5:
        //not numeration
        var newstyle=this.extract_style('item','border-radius_margin-left',colors.checked?'17px 17px 17px 17px_0px':'0px 17px 17px 0px_30px');
        var newstyleNumber=this.extract_style('content-item-number','display',colors.checked?'none':'flex');
          
        item.forEach((element,id)=>{
          element.setAttribute('style',newstyle);
          item_number[id].setAttribute('style',newstyleNumber);            
        });

        break;
      case 6:
        //color numbers
        var newstyle=this.extract_style('item-number','color',colors.value);
          
        numberIten.forEach((element)=>{
            element.setAttribute('style',newstyle);            
        });
          
    };
    
  }
/*Can't bind to 'ngForOf' since it isn't a known property of 'option'. */
}

