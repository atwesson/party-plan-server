const { ItemsModel } = require("../models")
const validateSession = require("../middlewares/validate-session")

const router = require("express").Router()



router.get("/", validateSession, async (req, res) => {
    let { id } = req.user
    try {
        const allItemsSources = await ItemsModel.findAll({
            where:
            {
                owner: id
            }
        })

        res.status(200).json(allItemsSources)
    } catch (err) {

        res.status(500).json({
            error: err,
        })
    }
})


router.post("/create/", validateSession, async (req, res) => {

    const { name,
        amount,
        who,
        done, } = req.body;
    const { id } = req.user

    const ItemsEntry = {
        name,
        amount,
        who,
        done,
        owner: id
    }

    try {
        const newItems = await ItemsModel.create(ItemsEntry, req.user.id);

        res.status(201).json({
            message: "Income made suceessfully",
            ItemsEntry,
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create Items ${err}`
        })
    }
})


router.delete("/:id", validateSession, async (req, res) => {
    try {
        await ItemsModel.destroy({
            where: {
                id: req.params.id,
                owner: req.user.id
            }
        }
        ).then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Items successfully deleted",
                    deletedItems: result
                })
            } else {
                res.status(400).json({
                    message: "Item does not exist"
                })
            }

        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete Items: ${err}`
        })
    }
})

router.put("/:id", validateSession, async (req, res) => {
    const {         
        name,
        amount,
        who,
        done,} = req.body;

    const itemsId = req.params.id
    const userId = req.user.id

    const query = {
        where: {
            id: itemsId,
            owner: userId
        }
    };
    const updatedModel = {
        name,
        amount,
        who,
        done,
    };
    try {
        const update = await ItemsModel.update(updatedModel, query);
        res.status(200).json({ message: "Items successfully edited" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router