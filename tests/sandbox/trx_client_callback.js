 
 
 const {Translate} = require('@google-cloud/translate').v2;

 // Creates a client
 const translate = new Translate();
 
 
  // TODO(developer) Uncomment the following lines before running the sample.
  
  const text = 'perché';
  const target = 'en';
 
 
 
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
   let translations =  translate.translate(text, target);
   //translations = Array.isArray(translations) ? translations : [translations];

   translations.then((val)=>{
       console.log(val);
       console.log(val[1].data);
   });
   /* console.log('Translations');
   translations.forEach((translation, i) => {
     console.log(`${text[i]} = (${target}) ${translation}`);
   }); */
 }

 translateText();