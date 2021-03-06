export const QUESTION_RESPONSE_MOCK = {
  id: 38600,
  question_text: 'This is a text explaining the question. Read it carefully!',
  type_name: 'Evaluated C-lang question',
  last_used: '2018-10-02 16:03:42',
  count_used: 20,
  tests: [
    {
      id_question: 38600,
      c_test_type_id: 1,
      percentage: '100.00',
      allow_diff_order: false,
      allow_diff_letter_size: true,
      trim_whitespace: true,
      comment: '',
      regex_override: '',
      input: '189',
      output: '0000 00BD',
      generator_test_file_id: null,
      arguments: null,
      description: null,
      random_test_type_id: null,
      low_bound: null,
      upper_bound: null,
      elem_count: null,
      random_test_type_name: null,
      id: 6,
    },
    {
      id_question: 38600,
      c_test_type_id: 1,
      percentage: '100.00',
      allow_diff_order: false,
      allow_diff_letter_size: true,
      trim_whitespace: true,
      comment: '',
      regex_override: '',
      input: '12345678',
      output: '00BC 614E',
      generator_test_file_id: null,
      arguments: null,
      description: null,
      random_test_type_id: null,
      low_bound: null,
      upper_bound: null,
      elem_count: null,
      random_test_type_name: null,
      id: 7,
    },
    {
      id_question: 38600,
      c_test_type_id: 1,
      percentage: '100.00',
      allow_diff_order: false,
      allow_diff_letter_size: true,
      trim_whitespace: true,
      comment: '',
      regex_override: '',
      input: '2147483647',
      output: '7FFF FFFF',
      generator_test_file_id: null,
      arguments: null,
      description: null,
      random_test_type_id: null,
      low_bound: null,
      upper_bound: null,
      elem_count: null,
      random_test_type_name: null,
      id: 8,
    },
  ],
};

export const LEVEL_CONFIG_MOCK = {
  id: 'level1',
  corridors: [
    {
      type: 'Corridor4',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 9, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -9, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 0, y: 0, z: 9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 0, y: 0, z: -9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 9, y: 0, z: -18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 9, y: 0, z: 18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -9, y: 0, z: 18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -9, y: 0, z: -18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 18, y: 0, z: 9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -18, y: 0, z: 9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -18, y: 0, z: -9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 18, y: 0, z: -9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: 18, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: -18, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: 0, y: 0, z: 18 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: 0, y: 0, z: -18 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: 18, y: 0, z: 18 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: -18, y: 0, z: 18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: 18, y: 0, z: -18 },
      rotation: { x: 0, y: Math.PI, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: -18, y: 0, z: -18 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
  ],
  pickups: [
    {
      id: 'pickup1',
      position: { x: 0, y: 0, z: 0 },
    },
    {
      id: 'pickup2',
      position: { x: 18, y: 0, z: 18 },
    },
    {
      id: 'pickup3',
      position: { x: -18, y: 0, z: 18 },
    },
    {
      id: 'pickup4',
      position: { x: -18, y: 0, z: -18 },
    },
    {
      id: 'pickup5',
      position: { x: 18, y: 0, z: -18 },
    },
  ],
  lights: [
    {
      id: 'pointLight1',
      position: { x: 0, y: 2.4, z: 0 },
      intensity: 1,
    },
    {
      id: 'pointLight2',
      position: { x: 18, y: 2.4, z: 18 },
      intensity: 0.3,
    },
    {
      id: 'pointLight3',
      position: { x: -18, y: 2.4, z: -18 },
      intensity: 0.3,
    },
  ],
  spawnPoint: { x: 9, y: 2, z: 0 },
};
