import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.js";

const origin = "https://graymatterdigitalsolutions.com";
const env = {OPERATOR_KEY:"test-secret-not-a-real-key",ALLOWED_ORIGIN:origin,DB:{}};

test("API requires an operator key",async()=>{
  const response = await worker.fetch(new Request("https://example.workers.dev/api/contacts"),env);
  assert.equal(response.status,401);
  assert.equal((await response.json()).error,"Invalid access key.");
});

test("API blocks an unknown browser origin",async()=>{
  const response = await worker.fetch(new Request("https://example.workers.dev/api/contacts",{
    headers:{Origin:"https://attacker.example",Authorization:"Bearer test-secret-not-a-real-key"}
  }),env);
  assert.equal(response.status,403);
});

test("CORS preflight permits only configured browser origin",async()=>{
  const response = await worker.fetch(new Request("https://example.workers.dev/api/contacts",{
    method:"OPTIONS",headers:{Origin:origin}
  }),env);
  assert.equal(response.status,204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"),origin);
});

test("unknown private route fails after authorization",async()=>{
  const response = await worker.fetch(new Request("https://example.workers.dev/api/unknown",{
    headers:{Origin:origin,Authorization:"Bearer test-secret-not-a-real-key"}
  }),env);
  assert.equal(response.status,404);
});

test("voice webhook rejects unsigned requests",async()=>{
  const response = await worker.fetch(new Request("https://example.workers.dev/voice",{
    method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:"DialToken=00000000-0000-0000-0000-000000000000"
  }),env);
  assert.equal(response.status,403);
  assert.match(await response.text(),/Hangup/);
});

test("browser cannot call TwiML webhook using GET",async()=>{
  const response = await worker.fetch(new Request("https://example.workers.dev/voice"),env);
  assert.equal(response.status,405);
});
