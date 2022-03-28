 
 
 const {Translate} = require('@google-cloud/translate').v2;

 // Creates a client
 const translate = new Translate();
 
  
  //const text = 'perché';
  const text = 'a';
  const target = 'en';

  const source = 'it';

  const options = {
    from:'it', 
    to:'en'
  }
 
 
 
function translateText22() {
    // Translates the text into the target language. text can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    translate.translate(text, target, (val) => {
        console.log("callback");
        console.log(JSON.stringify(val));
    }
    );
}


function translateText() {
    // Translates the text into the target language. text can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.

   let translations =  translate.translate(text, options);


   translations.then((val)=>{
       console.log(val);
       console.log(val[1].data);
   });
 }

 translateText();