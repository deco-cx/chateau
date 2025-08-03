// deno-lint-ignore-file require-await
import { withRuntime } from "@deco/workers-runtime";
import {
  createStepFromTool,
  createTool,
  createWorkflow,
} from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env as DecoEnv } from "./deco.gen.ts";

interface Env extends DecoEnv {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

const createMyTool = (_env: Env) =>
  createTool({
    id: "MY_TOOL",
    description: "Say hello",
    inputSchema: z.object({ name: z.string() }),
    outputSchema: z.object({ message: z.string() }),
    execute: async ({ context }) => ({
      message: `Hello, ${context.name}!`,
    }),
  });

// Tool para reexportar AI_GENERATE_OBJECT
const createAIGenerateObjectTool = (env: Env) =>
  createTool({
    id: "AI_GENERATE_OBJECT",
    description: "Generate structured objects using AI models with JSON schema validation",
    inputSchema: z.object({
      messages: z.array(z.object({
        id: z.string().optional(),
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
        createdAt: z.string().optional(),
        experimental_attachments: z.array(z.object({
          name: z.string().optional(),
          contentType: z.string().optional(),
          url: z.string()
        })).optional()
      })),
      schema: z.record(z.any()),
      model: z.string().optional(),
      maxTokens: z.number().optional(),
      temperature: z.number().optional(),
      tools: z.record(z.array(z.string())).optional()
    }),
    outputSchema: z.object({
      object: z.record(z.any()).optional(),
      usage: z.object({
        promptTokens: z.number(),
        completionTokens: z.number(),
        totalTokens: z.number(),
        transactionId: z.string()
      }),
      finishReason: z.string().optional()
    }),
    execute: async ({ context }) => {
      // Chamar a tool AI_GENERATE_OBJECT da integração DECO_CHAT_WORKSPACE_API
      return await env.DECO_CHAT_WORKSPACE_API.AI_GENERATE_OBJECT({
        messages: context.messages,
        schema: context.schema,
        model: context.model,
        maxTokens: context.maxTokens,
        temperature: context.temperature,
        tools: context.tools
      });
    },
  });

const createMyWorkflow = (env: Env) => {
  const step = createStepFromTool(createMyTool(env));

  return createWorkflow({
    id: "MY_WORKFLOW",
    inputSchema: z.object({ name: z.string() }),
    outputSchema: z.object({ message: z.string() }),
  })
    .then(step)
    .commit();
};

const fallbackToView = (viewPath: string = "/") => (req: Request, env: Env) => {
  const LOCAL_URL = "http://localhost:4000";
  const url = new URL(req.url);
  const useDevServer = (req.headers.get("origin") || req.headers.get("host"))
    ?.includes("localhost");

  const request = new Request(
    useDevServer
      ? new URL(`${url.pathname}${url.search}`, LOCAL_URL)
      : new URL(viewPath, req.url),
    req,
  );

  return useDevServer ? fetch(request) : env.ASSETS.fetch(request);
};

const { Workflow, ...runtime } = withRuntime<Env>({
  workflows: [createMyWorkflow],
  tools: [createMyTool, createAIGenerateObjectTool],
  fetch: fallbackToView("/"),
});

export { Workflow };

export default runtime;
