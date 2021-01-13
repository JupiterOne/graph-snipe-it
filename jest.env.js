process.env.RUNNING_TESTS = 'true';
process.env.ENABLE_GRAPH_OBJECT_SCHEMA_VALIDATION = '1';

require('jest-fetch-mock').enableMocks();
fetchMock.dontMock();
