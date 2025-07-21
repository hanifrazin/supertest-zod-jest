const hitApi = require('./helper/requestWithDefaults');
const masterSchema = require('./schema/master.schema');
const allure = require('allure-js-commons');

describe('E2E Test', () => {

    it('E2E Restfull Booker', async() => {
        await allure.displayName("E2E Restfull Booker")
        
        // POST - should be successfull generate token
        const dataAccount = {
            "username" : "admin",
            "password" : "password123"
        }
        let token = "abc";
        await allure.step("Hit Post /auth", async() => {
            const resGenToken = await hitApi('post','/auth', dataAccount);
            
            const schemaGenToken = masterSchema.validateWithSchema(masterSchema.getToken, resGenToken._body) 
            token = resGenToken._body.token;

            await allure.step('Check Status Code nya 200', async() => {
                expect(resGenToken.statusCode).toBe(200);
            });
            await allure.step('Compare Schema dengan Contract API', async() => {
                expect(schemaGenToken.success).toBe(true);
            });
        });
     


        // POST - Create Booking with Hit API createBooking
        const bodyCreate = {
            "firstname" : "Jim",
            "lastname" : "Brown",
            "totalprice" : 10000000,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2025-08-01",
                "checkout" : "2025-08-10"
            },
            "additionalneeds" : "Breakfast"
        }

        const resCreateBooking = await hitApi('post','/booking',bodyCreate);
        const schemaCreateBooking = masterSchema.validateWithSchema(masterSchema.createBooking,resCreateBooking._body)
        const resBookingId = resCreateBooking._body.bookingid;
        expect(schemaCreateBooking.success).toBe(true);
        expect(resCreateBooking.statusCode).toBe(200);
        expect(resCreateBooking._body.booking.firstname).toBe(bodyCreate.firstname);
        expect(resCreateBooking._body.booking.lastname).toBe(bodyCreate.lastname);
        expect(resCreateBooking._body.booking.totalprice).toBe(bodyCreate.totalprice);
        expect(resCreateBooking._body.booking.depositpaid).toBe(bodyCreate.depositpaid);
        expect(resCreateBooking._body.booking.bookingdates.checkin).toBe(bodyCreate.bookingdates.checkin);
        expect(resCreateBooking._body.booking.bookingdates.checkout).toBe(bodyCreate.bookingdates.checkout);
        expect(resCreateBooking._body.booking.additionalneeds).toBe(bodyCreate.additionalneeds);


        // GET - List All Booking
        const queryParamsByName = {
            firstname: "Jim",
            lastname: "Brown"
        }

        const resGetListBooking = await hitApi('get','/booking',null,null,queryParamsByName);
        const schemaGeListBooking = masterSchema.validateWithSchema(masterSchema.getListBookingByName, resGetListBooking._body)
        expect(schemaGeListBooking.success).toBe(true)
        expect(resGetListBooking._body.length).toBeGreaterThan(1)


        // GET - Check Booking data using BookingID
        const resGetBookingData = await hitApi('get',`/booking/${resBookingId}`)
        const schemaGetBookingById = masterSchema.validateWithSchema(masterSchema.getBookingById,resGetBookingData._body);
        expect(schemaGetBookingById.success).toBe(true);
        expect(resGetBookingData.statusCode).toBe(200);
        expect(resGetBookingData._body.firstname).toBe(bodyCreate.firstname);
        expect(resGetBookingData._body.lastname).toBe(bodyCreate.lastname);
        expect(resGetBookingData._body.totalprice).toBe(bodyCreate.totalprice);
        expect(resGetBookingData._body.depositpaid).toBe(bodyCreate.depositpaid);
        expect(resGetBookingData._body.bookingdates.checkin).toBe(bodyCreate.bookingdates.checkin);
        expect(resGetBookingData._body.bookingdates.checkout).toBe(bodyCreate.bookingdates.checkout);
        expect(resGetBookingData._body.additionalneeds).toBe(bodyCreate.additionalneeds);


        // PUT - Update Booking
        const updateData = {
            "firstname" : "James",
            "lastname" : "Brown",
            "totalprice" : 15000000,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2025-08-10",
                "checkout" : "2025-08-20"
            },
            "additionalneeds" : ["Dinner","Breakfast","Lunch"]           
        }

        const resUpdateBooking = await hitApi('put',`/booking/${resBookingId}`,updateData,token);
        const schemaUpdateBooking = masterSchema.validateWithSchema(masterSchema.updateBooking,resUpdateBooking._body);
        expect(schemaUpdateBooking.success).toBe(true);
        expect(resUpdateBooking.statusCode).toBe(200);
        expect(resUpdateBooking._body.firstname).toBe(updateData.firstname);
        expect(resUpdateBooking._body.lastname).toBe(updateData.lastname);
        expect(resUpdateBooking._body.totalprice).toBe(updateData.totalprice);
        expect(resUpdateBooking._body.depositpaid).toBe(updateData.depositpaid);
        expect(resUpdateBooking._body.bookingdates.checkin).toBe(updateData.bookingdates.checkin);
        expect(resUpdateBooking._body.bookingdates.checkout).toBe(updateData.bookingdates.checkout);
        expect(resUpdateBooking._body.additionalneeds).toEqual(updateData.additionalneeds);


        // DELETE - Remove Booking
        const resDeleteBookingData = await hitApi('delete',`/booking/${resBookingId}`,null,token)
        expect(resDeleteBookingData.statusCode).toBe(201);
        

        // GET - Check Booking data using deleted BookingID
        const resCheckBookingDeleted = await hitApi('get',`/booking/${resBookingId}`)
        expect(resCheckBookingDeleted.statusCode).toBe(404);
    },50000);
});