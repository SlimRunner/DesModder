import { testWithPage } from "#tests";

const CAPTURE = ".dsm-menu-container .dsm-vc-capture-menu";
const PREVIEW = ".dsm-menu-container .dsm-vc-preview-menu";
const EXPORT = ".dsm-menu-container .dsm-vc-export-menu";
const EXPANDED = ".dsm-vc-preview-expanded";
const PREVIEW_IMG = ".dsm-menu-container .dsm-vc-preview-current-frame img";
const GRAPHPAPER = ".dcg-graph-outer";

describe("Video Creator", () => {
  testWithPage("Menuing", async (driver) => {
    // Open menu. It should be FFmpeg loading
    await driver.click(".dsm-pillbox-buttons :nth-child(2)");
    await driver.assertSelector(".dsm-menu-container .dsm-delayed-reveal");

    // Eventually, FFmpeg loads. Capture menu but no preview/export
    await driver.assertSelectorEventually(CAPTURE);
    await driver.assertSelectorNot(PREVIEW, EXPORT);

    // Click "capture" with default settings
    await driver.click(".dsm-vc-capture-frame-button");
    await driver.assertSelectorEventually(PREVIEW);
    await driver.assertSelector(CAPTURE, EXPORT);

    // Click the big preview
    await driver.click(".dsm-vc-preview-current-frame");
    await driver.assertSelector(EXPANDED);

    // Click the x
    await driver.click(".dsm-vc-exit-expanded");
    await driver.assertSelectorNot(EXPANDED);

    // Click "delete all"
    await driver.click(".dsm-vc-delete-all .dsm-btn");
    await driver.assertSelector(CAPTURE);
    await driver.assertSelectorNot(PREVIEW, EXPORT);

    // Click graphpaper to close menu
    await driver.click(GRAPHPAPER);
  });

  testWithPage("Resizing screenshot", async (driver) => {
    // Open menu. It should be FFmpeg loading
    await driver.click(".dsm-pillbox-buttons :nth-child(2)");
    await driver.assertSelector(".dsm-menu-container .dsm-delayed-reveal");

    // Eventually, FFmpeg loads. Capture menu but no preview/export
    await driver.assertSelectorEventually(CAPTURE);
    await driver.assertSelectorNot(PREVIEW, EXPORT);

    const testSettings = [
      { fast: false, pixratio: false }, // fails 0.5:1 and 0.5:0.5
      { fast: false, pixratio: true }, // passes all
      { fast: true, pixratio: false }, // fails 0.5:1 and 0.5:0.5
      { fast: true, pixratio: true }, // passes all
    ];
    const testRatios = [
      { width: 1, height: 1 }, // as is
      { width: 0.5, height: 1 }, // smaller width
      { width: 2, height: 1 }, // larger width
      { width: 1, height: 0.5 }, // smaller height
      { width: 1, height: 2 }, // larger height
      { width: 0.5, height: 0.5 }, // smaller image
      { width: 2, height: 2 }, // larger image
    ];

    const defaultSize = await driver.getCaptureSize();
    if (defaultSize === null) {
      fail("Default size is undefined");
    }

    for (const setting of testSettings) {
      await driver.setCaptureChecks(setting.fast, setting.pixratio);

      for (const ratio of testRatios) {
        await driver.setCaptureSize(
          (defaultSize.width * ratio.width).toString(),
          (defaultSize.height * ratio.height).toString()
        );
        await driver.waitForSync();

        // Evaluate capture size entry to get/set expected screenshot size
        const { width, height } = await driver.page.$eval(
          ".dsm-vc-capture-size",
          (elem) => {
            const [widthEntry, heightEntry] = Array.from(
              elem.querySelectorAll(
                ".dcg-inline-math-input-view .dcg-math-field .dcg-mq-root-block"
              )
            );
            const result = {
              width: parseInt(widthEntry.textContent ?? "-1"),
              height: parseInt(heightEntry.textContent ?? "-1"),
            };

            return result;
            // return {widthEntry, heightEntry};
          }
        );
        expect(width && width !== -1, `width is ${width?.toString()}`).toBeTruthy();
        expect(height && height !== -1, `height is ${height?.toString()}`).toBeTruthy();

        // Click "capture"
        await driver.click(".dsm-vc-capture-frame-button");
        await driver.assertSelectorEventually(PREVIEW);
        await driver.assertSelector(CAPTURE, EXPORT, PREVIEW_IMG);

        // Evaluate preview image element to get actual screenshot size.
        const imagePreview = await driver.page.$eval(PREVIEW_IMG, (elem) => {
          return {
            naturalWidth: elem.naturalWidth,
            naturalHeight: elem.naturalHeight,
          };
        });

        const msgReceived = `${imagePreview.naturalWidth}×${imagePreview.naturalHeight}`;
        const msgExpected = `${width}×${height}`;
        const msg =
          `expected: ${msgExpected}, received: ${msgReceived}, ` +
          `ratio: ${ratio.width}:${ratio.height}`;

        expect(imagePreview.naturalWidth, msg).toEqual(width);
        expect(imagePreview.naturalHeight, msg).toEqual(height);

        await driver.click(".dsm-vc-remove-frame");
      }
    }

    // Click graphpaper to close menu
    await driver.click(GRAPHPAPER);
  });
});
