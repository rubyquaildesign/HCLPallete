import Slider from './SliderStoryDecorator.svelte';
export default {
  title: 'Slider',
  component: Slider,
  args: {
    value: 2,
    hexColor: '#fee088',
  },
};
export const Slide = (args) => ({
  Component: Slider,
  props: {
    ...args,
  },
});
