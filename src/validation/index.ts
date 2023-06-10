const { Joi } = require("express-validation");

export const userValidation = {
    imageGenerate: Joi.object({
        category: Joi.array().items(
            Joi.object()
                .keys({
                    name: Joi.string().required(),
                    categoryName: Joi.string().required(),
                    order: Joi.number().required(),
                    rarity: Joi.number().required(),
                    userProbability: Joi.boolean().required(),
                    file: Joi.array().items(
                        Joi.object()
                            .keys({
                                image: Joi
                                    .object().required()
                                // .object()
                                // .keys({
                                //     originalname: Joi.string().required(),
                                //     mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
                                //     size: Joi.number().max(1 * 1024 * 1024).required(),
                                // })
                                // .unknown(true),
                            })
                            .unknown(true)
                            .required(),
                    ).required()
                })
                .unknown(true)
                .required(),



        )
    })

};
// export const userValidation = {
//     imageGenerate: {
//         body: Joi.object({
//             category: Joi.array().items(
//                 Joi.object()
//                     .keys({
//                         name: Joi.string().required(),
//                         categoryName: Joi.string().required(),
//                         order: Joi.number().required(),
//                         rarity: Joi.number().required(),
//                         userProbability: Joi.boolean().required(),
//                         file: Joi.array().items(
//                             Joi.object()
//                                 .keys({
//                                     image: Joi.object()
//                                         .keys({
//                                             originalname: Joi.string().required(),
//                                             mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
//                                             size: Joi.number().max(1 * 1024 * 1024).required(),
//                                         })
//                                         .unknown(true),
//                                 })
//                                 .unknown(true)
//                                 .required(),
//                         ),
//                     })
//                     .unknown(true)
//                     .required(),



//             )
//         })

//     },
// };
