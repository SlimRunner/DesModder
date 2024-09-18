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

    // test all capture options
    const testSettings = [
      { fast: false, pixratio: false },
      { fast: false, pixratio: true },
      { fast: true, pixratio: false },
      { fast: true, pixratio: true },
    ];

    // test different ratios and sizes
    const testRatios = [
      { width: 1, height: 1 }, // as is
      { width: 0.5, height: 1 }, // smaller width
      { width: 2, height: 1 }, // larger width
      { width: 1, height: 0.5 }, // smaller height
      { width: 1, height: 2 }, // larger height
      { width: 0.5, height: 0.5 }, // smaller image
      { width: 2, height: 2 }, // larger image
      { width: 1.5, height: 1.25 },
      { width: 0.75, height: 1.123 },
      { width: 1.2, height: 0.256 },
    ];

    const defaultSize = await driver.getCaptureSize();
    if (defaultSize === null) {
      fail("Default size is undefined");
    }

    // iterate through all combinations of tests
    for (const setting of testSettings) {
      // set screenshot options
      await driver.setCaptureChecks(setting.fast, setting.pixratio);

      for (const ratio of testRatios) {
        // set screenshot size
        await driver.setCaptureSize(
          Math.floor(defaultSize.width * ratio.width).toString(),
          Math.floor(defaultSize.height * ratio.height).toString()
        );

        // get size from latex fields to make sure it updated
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
          }
        );
        expect(width && width !== -1, `width is ${width?.toString()}`).toBeTruthy();
        expect(height && height !== -1, `height is ${height?.toString()}`).toBeTruthy();

        // Click "capture"
        await driver.click(".dsm-vc-capture-frame-button");
        await driver.assertSelectorEventually(PREVIEW);
        await driver.assertSelector(CAPTURE, EXPORT, PREVIEW_IMG);

        // Get size of screenshot captured
        const imagePreview = await driver.page.$eval(PREVIEW_IMG, (elem) => {
          return {
            naturalWidth: elem.naturalWidth,
            naturalHeight: elem.naturalHeight,
          };
        });

        const msgRecived = `${imagePreview.naturalWidth}×${imagePreview.naturalHeight}`;
        const msgExpected = `${width}×${height}`;
        const errorMsg =
          `expected: ${msgExpected}, recived: ${msgRecived}, ` +
          `ratio: ${ratio.width}:${ratio.height}`;

        expect(imagePreview.naturalWidth, errorMsg).toEqual(width);
        expect(imagePreview.naturalHeight, errorMsg).toEqual(height);

        // click the remove frame button
        await driver.click(".dsm-vc-remove-frame");
      }
    }

    // Click graphpaper to close menu
    await driver.click(GRAPHPAPER);
  });
});
