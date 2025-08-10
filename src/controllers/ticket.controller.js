import asyncHandler from "../middlewares/asyncHandler.js";
import Client from "../models/ClientModel.js";
import Notification from "../models/NotificationModel.js";
import Ticket from "../models/TicketModel.js";
// import formateDate from "../utils/formateDate.js";
import responseHandler from "../utils/response.js";

export const createTicket = asyncHandler(async (req, res) => {
  try {
    const { to, from } = req.body;

    if (!to || !from) {
      return responseHandler(
        res,
        400,
        "Both 'to' and 'from' fields are required"
      );
    }

    const client = await Client.findOne({ phone: to });
    if (!client) {
      return responseHandler(res, 404, "Client not found");
    }

    const ticket = await Ticket.create({ to, from });
    const whatsappPayload = {
      messaging_product: "whatsapp",
      to: client.phone,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
        // components: [
        //   {
        //     type: "header",
        //     parameters: [{ type: "text", text: client.name }],
        //   },
        //   {
        //     type: "body",
        //     parameters: [
        //       { type: "text", text: from },
        //       { type: "text", text: formatDate(new Date()) },
        //     ],
        //   },
        // ],
      },
    };

    const whatsappResponse = await fetch(process.env.WHATSAPP_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(whatsappPayload),
    });

    if (!whatsappResponse.ok) {
      const errorData = await whatsappResponse.json();
      console.error("WhatsApp API Error:", errorData);
      throw new Error("Failed to send WhatsApp notification");
    }
    const notes = await Notification.create({
      userId: client?.clientId,
      message: `the customer ${from} create a ticket to contact again`,
      type: "ticket",
    });

    if (!notes) {
      return responseHandler(
        res,
        400,
        "something wrong in create notification"
      );
    }
    return responseHandler(res, 201, {
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Ticket creation error:", error.message);

    if (error.name === "ValidationError") {
      return responseHandler(res, 400, "Invalid ticket data");
    }

    return responseHandler(res, 500, "Internal server error");
  }
});

export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find();
  return responseHandler(res, 200, "get tickets successfully", tickets);
});
