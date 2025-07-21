const { z } = require('zod');

class BookerSchemas {
    static getToken = z.object({
        token: z.string()
    });

    static createBooking = z.object({
        bookingid: z.number(),
        booking: z.object({
            firstname: z.string(),
            lastname: z.string(),
            totalprice: z.int(),
            depositpaid: z.boolean(),
            bookingdates: z.object({
                checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
            }),
            additionalneeds: z.union([z.array(z.string()),z.string()])
        })
    })

    static getBookingById = z.object({
        firstname: z.string(),
        lastname: z.string(),
        totalprice: z.int(),
        depositpaid: z.boolean(),
        bookingdates: z.object({
            checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        }),
        additionalneeds: z.union([z.array(z.string()),z.string()])
    })

    static getListBookingByName = z.array(z.object({
        bookingid: z.number()
    }))

    static updateBooking = z.object({
        firstname: z.string(),
        lastname: z.string(),
        totalprice: z.int(),
        depositpaid: z.boolean(),
        bookingdates: z.object({
            checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        }),
        additionalneeds: z.union([z.array(z.string()),z.string()])
    })

    static validateWithSchema(schema,data){
        const result = schema.safeParse(data);

        if(!result.success){
            console.error("❌ Zod Validation Failed:\n", result.error.format());
        }

        return result;
    }
}

module.exports = BookerSchemas;