import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import App from "../../app/app.vue";

describe("App Component", () => {
  it("should mount successfully", async () => {
    // given
    const component = await mountSuspended(App, {
      route: "/",
    });

    // when
    const html = component.html();

    // then
    expect(html).toBeTruthy();
  });

  it("should render div wrapper", async () => {
    // given
    const component = await mountSuspended(App, {
      route: "/",
    });

    // when
    const wrapper = component.find("div");

    // then
    expect(wrapper.exists()).toBe(true);
  });
});
