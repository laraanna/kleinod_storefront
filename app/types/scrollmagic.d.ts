// declare module 'scrollmagic' {
//   class ScrollMagicController {
//     addScene(scene: ScrollMagicScene): ScrollMagicController;
//     removeScene(scene: ScrollMagicScene): ScrollMagicController;
//     destroy(resetScenes?: boolean): ScrollMagicController;
//   }

//   class ScrollMagicScene {
//     constructor(options?: {
//       duration?: number | string;
//       offset?: number;
//       triggerElement?: string | HTMLElement;
//       triggerHook?: number | 'onEnter' | 'onLeave' | 'onCenter';
//       reverse?: boolean;
//       loglevel?: number;
//     });

//     setPin(element: string | HTMLElement, options?: { pushFollowers?: boolean }): ScrollMagicScene;
//     addTo(controller: ScrollMagicController): ScrollMagicScene;
//     addIndicators(options?: {
//       name?: string;
//       colorTrigger?: string;
//       colorStart?: string;
//       colorEnd?: string;
//     }): ScrollMagicScene;
//     removeIndicators(): ScrollMagicScene;
//     destroy(reset?: boolean): ScrollMagicScene;
//   }

//   export const Controller: typeof ScrollMagicController;
//   export const Scene: typeof ScrollMagicScene;

//   // For proper types, ensure both the controller and scene are accessible
//   export { ScrollMagicController, ScrollMagicScene };
// }

declare module 'scrollmagic' {
  const ScrollMagic: any;
  export = ScrollMagic;
}

