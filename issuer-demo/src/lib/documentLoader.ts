import axios from "axios";
import vc from "@digitalcredentials/vc";

import testContext from "../resources/contexts/index";

const documentLoader = async (url: string) => {
  const context = testContext.get(url);
  if (context) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: context,
    };
  }

  if (url && (url.startsWith("https:") || url.startsWith("http:"))) {
    const { data: document } = await axios.get(url);
    const result = {
      contextUrl: null,
      document,
      documentUrl: url,
    };
    return result;
  }

  return vc.defaultDocumentLoader(url);
};

export default documentLoader;
