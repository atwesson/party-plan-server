const { response } = require("express")
const { PartiesModel } = require("../models")
const Parties = require("../models/parties")
const validateSession = require("../middlewares/validate-session")

const router = require("express").Router()



router.get("/", validateSession, async (req, res) => {
    let {id} = req.user
    try {
        const allParties = await PartiesModel.findAll({
            where:{
                owner: id
            }
        })

        res.status(200).json(allParties)
    } catch (err) {

        res.status(500).json({
            error: err,
        })
    }
})

router.post("/create", validateSession, async (req, res) => {

    const {
        name,
        location,
        time,
        type,
        public} = req.body;

    const { id } = req.user

    const PartiesEntry = {
        name,
        location,
        time,
        type,
        public,
        owner: id
    } 

        try {
            const newParties = await PartiesModel.create(PartiesEntry, req.user.id);
            res.status(201).json({
                message: "Parties made suceessfully",
                PartiesEntry,
            })
        } catch (err) {
            res.status(500).json({
                message: `Failed to create Parties: ${err}`
            })
        }
    })


router.delete("/:id", validateSession, async (req, res) => {
    try {
        await PartiesModel.destroy({
            where: {
                id: req.params.id,         
                owner: req.user.id
            }
        }).then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Parties successfully deleted",
                    deletedParties: result
                })
            } else {
                res.status(400).json({
                    message: "Parties does not exist"
                })
            }

        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete Parties source: ${err}`
        })
    }
})

router.put("/:id", validateSession, async (req, res) => {
    const {name,
        location,
        time,
        type,
        public} = req.body;

        const partiesId = req.params.id
        const userId = req.user.id

    const query = {
        where: {
            id: partiesId,
            owner: userId
        }
    };
    const updatedModel = {name,
        location,
        time,
        type,
        public
    };
    
    try {
        const update = await PartiesModel.update(updatedModel, query);
        res.status(200).json({message: "Expense successfully edited"});
    } catch (err) {
        res.status(500).json ({ error: err });
    }
});



module.exports = router