import { TRPCError } from "@calcom/trpc";
import prisma from "@calcom/prisma";

export async function checkOncePerUserLimitAndThrowError(bookerEmail: String) {
    const previousBookings = await prisma.booking.findMany({where: { status: 'ACCEPTED'}});

    if (previousBookings.length > 0) {
        const alreadyBookedEmails = previousBookings.reduce((accumulator: any, currentValue: any) => 
            {
                const responses: any = currentValue.responses;
                if (responses){
                    accumulator.push(responses.email);
                }
                return accumulator;
            }
                ,[]);

            if (alreadyBookedEmails.includes(bookerEmail)){
                throw new TRPCError({
                code: "BAD_REQUEST",
                message: `User have already an ACTIVE reservation for the current day`,
                });
            }
    }
}

