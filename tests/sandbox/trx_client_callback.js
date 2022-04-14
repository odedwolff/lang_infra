

const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();


//const text = 'perché';
const text = 'a';
const target = 'en';

const source = 'it';

/* const options = {
  from:'it', 
  to:'en'
} */



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


exports.translateText = function (text, from, to) {

  const options = {
    from: from,
    to: to
  }

  let translations = translate.translate(text, options);


  translations.then((val) => {

    //console.log(`${text} -> ${val[0]}`);
  });
}



exports.translateText2 = function (text, from, to) {
  return new Promise((res, err) => {
    const options = {
      from: from,
      to: to
    }
    console.log(`sending trnaslation, text = ${text}, options: ${JSON.stringify(options)}`);
    let translations = translate.translate(text, options);
    translations.then((val) => {
      console.log(`${text} -> ${val[0]}`);
      res(val[0]);
    },
      (val) => { 
        err(val) 
      });
  }
  );

}



 //translateText2("cosa",{from:'en', to:'it'});