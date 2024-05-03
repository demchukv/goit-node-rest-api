import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    phone: Joi.string()
        .regex(/^[0-9]{10}$/).messages({'string.pattern.base': 'Номер телефону повинен містити 10 цифр.'})
        .required()
})

export const updateContactSchema = Joi.object({

})