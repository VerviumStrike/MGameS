//Requirements Importers
const Range = require("./resources/range/index.js")
const Express = require("express")
const Request = require("request")

//Variables
const Port = process.env.PORT || 80
const Web = Express()

//Express
Web.get("/:query", function(req, res){
    var Page = 1
    var IT = setInterval(function(){
        Request(`https://moddroid.com/page/${Page}?s=${req.params.query}`, function(err, rres, body){
            if(body.indexOf("Sorry! Page not found") != -1){
                clearInterval(IT)
                var MGamesT = []
                for( pages in Range.range(parseInt(Page))){
                    setTimeout(function(pages){
                        if(pages == 0){}else{
                            Request(`https://moddroid.com/page/${pages}?s=${req.params.query}`, function(err, rres2, body2){
                                var mgamesreg = body2.matchAll(/(class="d-flex position-relative archive-post" href=.+?")/g)
                                var mgames = Array.from(mgamesreg)
                                try{
                                    for( games in Range.range(20)){
                                        MGamesT.push(mgames[games][0].slice(52))
                                    }
                                }catch{ if(MGamesT[0] == "" || MGamesT[0] == null){ res.json({ "error": "Something went wrong please type the name perfectly." }) }else{ res.json(MGamesT) } }
                            })
                        }
                    }, 1000 * pages, pages)
                }
            }else{
                Page += 1
            }
        })
    }, 1000)
})
Web.listen(Port, ()=>{
console.log(`=============================
    Server Status: Online
    Port: ${Port}
=============================`)
})