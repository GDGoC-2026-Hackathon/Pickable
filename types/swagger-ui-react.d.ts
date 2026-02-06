declare module "swagger-ui-react" {
  import { ComponentType } from "react";

  interface SwaggerUIProps {
    url?: string;
    spec?: Record<string, unknown>;
    layout?: string;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: "example" | "model";
    displayOperationId?: boolean;
    displayRequestDuration?: boolean;
    docExpansion?: "list" | "full" | "none";
    filter?: boolean | string;
    maxDisplayedTags?: number;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    supportedSubmitMethods?: string[];
    tryItOutEnabled?: boolean;
    validatorUrl?: string | null;
    withCredentials?: boolean;
    persistAuthorization?: boolean;
    requestInterceptor?: (req: unknown) => unknown;
    responseInterceptor?: (res: unknown) => unknown;
    onComplete?: () => void;
    presets?: unknown[];
    plugins?: unknown[];
    deepLinking?: boolean;
    [key: string]: unknown;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
