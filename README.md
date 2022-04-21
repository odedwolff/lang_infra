"# lang_infra" 

OVERVIEW 
This system is an infrastructure tool for creating structured data designated 
for flash-card-like applications geared at learning  foreign languages. It 
reads a text file containing a list of words and their corresponding frequencies
in the language corpus. Then it translate seach word by sending it to Google 
Translate API. (this is not the ideal API for this since it’s better suited for
longer texts, but it’s what I got thus far. Ideally I would like to have an API 
to return a complete list of all translations of a given source word. The Google
API just returns a single translation. But it’s something to begin with I guess
and to hopefully build on later on).

IMPLEMENTATION DETAILS
The file is read in memory, its content is filtered for non relevant entries, 
different cased words are being united, then the processed list of  words is being 
split into batches, each batch is being internally processed asynchronously, but
the processing of the batches as such is synchronous, that is, parallel
within each batch, serial between batches. This is done to enable limiting of 
possible massive bursts of requests to the API, which seem to cause some issues. 
Batch size is adjustable, larger values yield more parallel running, smaller values 
more serial one. The Processing of each source word (after preprocessing as mentioned 
above) consists of sending it to the Translation API, then saving the source, 
target, count info in the database. 
