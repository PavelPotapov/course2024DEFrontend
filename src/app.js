import "./styles.js"
import { ButtonModel } from "@components/Button/model";

const runApp = () => {
  document.addEventListener("DOMContentLoaded", async () => {
    new ButtonModel()
  })
};

if (process.env.NODE_ENV === "development") {
  import("@shared/api/lib/index.js")
    .then(({ getMocks }) => getMocks().finally(() => { runApp(); }));

} else {
  document.addEventListener("DOMContentLoaded", async () => {
    new ButtonModel()
  })
}


