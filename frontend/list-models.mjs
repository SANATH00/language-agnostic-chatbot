import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.argv[2] || "AIzaSyCpge66tSm_7rLepCIEYe6uzVYyT-PdZmY";

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}

listModels();
