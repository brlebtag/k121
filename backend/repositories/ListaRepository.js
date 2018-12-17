const BaseRepository = require('./BaseRepository');

module.exports = class ListaRepository extends BaseRepository {
    constructor(db) {
        super(db);

        const Schema = db.Schema;

        this.schema = new Schema({
            titulo: String,
            amigos: [
                {
                    nome: String,
                    email: String,
                    amigo_id: { type: String, required: false },
                }
            ]
        });

        this.model = db.model('Lista', this.schema);
    }

    todos() {
        return this.model.find({});
    }

    async criar(data) {
        var model = new this.model(data);
        const error = model.validateSync();

        if (error)
        {
            throw "MODELO_NAO_VALIDO_EXEPTION";
        }

        await model.save();

        return model;
    }

    porId(id) {
        return this.model.findOne({_id: id});
    }

    async atualizar(id, dados) {
        await this.model.updateOne(
            {_id: id},
            {$set: dados}
        );
    }

    async excluir(id) {
        await this.model.deleteOne({_id: id});
    }
};