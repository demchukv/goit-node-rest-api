import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
    phone: Joi.string()
        .regex(/^\([0-9]{3}\) [0-9]{3}\-[0-9]{4}$/).messages({'string.pattern.base': 'Номер телефону повинен містити 10 цифр у форматі: (099) 999-9999.'})
        .required()
})

export const updateContactSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    email: Joi.string()
        .email({ minDomainSegments: 2 }),
    phone: Joi.string()
        .regex(/^\([0-9]{3}\) [0-9]{3}\-[0-9]{4}$/).messages({'string.pattern.base': 'Номер телефону повинен містити 10 цифр у форматі: (099) 999-9999.'})
})