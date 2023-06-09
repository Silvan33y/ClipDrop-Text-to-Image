const axios = require("axios");
const FormData = require("form-data");

exports.handler = async function(event, context) {
  const { prompt } = JSON.parse(event.body);

  const form = new FormData();
  form.append("prompt", prompt);

  try {
    const response = await axios.post("https://clipdrop-api.co/text-to-image/v1", form, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
        ...form.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
      },
      body: Buffer.from(response.data).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("ClipDrop API call failed:", error.response.data);
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ error: "ClipDrop API call failed" }),
    };
  }
};