const express = require("express");
const router = express.Router();
const DB = require("./teams");

router.get("/team", (req, res) => {
    return res.json(DB.teams);
});

router.get("/team/:id", (req, res) => {
    if(isNaN(req.params.id)){
       return res.sendStatus(400);  
    }else{
        const id = parseInt(req.params.id);
        const team = DB.teams.find((element) => element.id === id);

        if(team != undefined){
            return res.json(team);
        }else{
            return res.status(404).json({msg:"Time não encontrado"});
        }
    }
});

router.get("/team/search/:name", (req, res) => {
    if(req.params.name == undefined){
        return res.status(400).json({msg:`Nome ${req.params.name} inválido`});
    }else{
        const nameSearched = req.params.name;      
        const teams = filterTeams(DB.teams, nameSearched)

        if(teams.length > 0) {
            return res.json(teams);
        }else{
            return res.status(404).json({msg:"Nenhum time não encontrado"});
        }
    }
});

router.delete("/team/:id", (req, res) => {
    if(isNaN(req.params.id)){

       return res.sendStatus(400);
    
    }else{
        const id = parseInt(req.params.id);
        const index = DB.teams.findIndex((element) => element.id === id);

        if(index === -1){
            return res.status(404).json({msg:"Time não encontrado!"});
        }else{
            DB.teams.splice(index, 1);
            return res.json({msg:"Time foi deletado!"});
        }
    }
});

router.put("/team/:id", (req, res) => {
    if(isNaN(req.params.id)){
        return res.status(404).json({msg:"Informe um ID"});
    }else{
        const id = parseInt(req.params.id);
        const team = DB.teams.find((element) => element.id === id);

        if(team != undefined){
            const {
                name,
                city,
                state,
                league,
                titles,
                payroall
            } = req.body;

            if (name != undefined) team.name = name;
            if (city != undefined) team.city = city;
            if (state != undefined) team.state = state;
            if (league != undefined) team.league = league;
            if (titles != undefined) team.titles = titles;
            if (payroall != undefined) team.payroall = payroall;
            
            return res.status(200).json(team);
        }else{
            return res.status(404).json({msg:"Time não encontrado!"});
        }
    }
});

router.post("/team", (req, res) => {
    const {
      name,
      city,
      state,
      league,
      titles,
      payroall
    } = req.body;


    if (name && city && state && titles && payroall !== undefined){
        const leagues = ['A', 'B', 'C', null, undefined];
        if (leagues.includes(league)) {
            const id = DB.teams.length + 1; //todo: Usar outra coisa para aumentar o index;
            DB.teams.push({
                id,
                name,
                city,
                state,
                league,
                titles,
                payroall
            });
            return res.status(201).json({msg:"Time cadastrado com sucesso"});
        }
        return res.status(400).json({msg:`A série \'${league}\' não é permitida`});
    } 
    return res.status(400).json({msg:"Favor informar todos os dados obrigatórios"});
});

function filterTeams(arr, query) {
    return arr.filter(function(el) {
      return el.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })
}


module.exports = router;