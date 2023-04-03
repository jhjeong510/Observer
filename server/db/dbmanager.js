const os = require('os');
const { Client } = require('pg');
const sql = require('mssql');
const {poolPromise} = require("./accessdb");

let Gaus_Log_Device_Normal_idx;
let SelCon_system_log_idx;

const createDatabase = async () => {
  const clientInit = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    await clientInit.connect();
    const res = await clientInit.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname='${process.env.DB_DBNAME}'`);

    if (res.rows.length === 0) {
      // DB 생성
      // postgresql create database 에서 db이름은 쌍따옴표(")로 묶는게 좋음(공식문서 참조)
      // 리눅스(centos) 일때 LC_COLLATE, LC_CTYPE 값 => 'ko_KR.UTF-8' 사용
      // 윈도우 일때 LC_COLLATE, LC_CTYPE 값 => 'Korean_Korea.949' 사용
      let queryCreateDb = `CREATE DATABASE "${process.env.DB_DBNAME}" WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'ko_KR.UTF-8' LC_CTYPE = 'ko_KR.UTF-8' TABLESPACE = pg_default CONNECTION LIMIT = -1`;
      const osType = os.type();
      if (osType === 'Windows_NT') {
        queryCreateDb = `CREATE DATABASE "${process.env.DB_DBNAME}" WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'Korean_Korea.949' LC_CTYPE = 'Korean_Korea.949' TABLESPACE = pg_default CONNECTION LIMIT = -1`;
      }

      const res2 = await clientInit.query(queryCreateDb);
      //console.log('create db2 result: ', JSON.stringify(res2, null, 2));
      console.log('DB Check: observer database created');
      return res2;
    } else {
      console.log('DB Check: observer database exist');
    }
    await clientInit.end();

  } catch (error) {
    console.log('initMaindb error', error);
  }
}

const createTables = async () => {
  // const gausTable = `CREATE TABLE IF NOT EXISTS "Log_Device_Normal" (
  //     "LogIDX" bigint NOT NULL,
  //     "LogDate" varchar(8) NULL,
  //     "LogTime" varchar(6) NULL,
  //     "LogType" varchar(2) NULL,
  //     "LogStatus" varchar(3) NULL,
  //     "LogStatusName" varchar(50) NULL,
  //     "LogRFID" varchar(20) NULL,
  //     "LogPIN" varchar(20) NULL,
  //     "LogIDType" varchar(2) NULL,
  //     "LogIDCredit" varchar(10) NULL,
  //     "LogAuthType" varchar(2) NULL,
  //     "LogDeviceID" varchar(3) NULL,
  //     "LogDeviceName" varchar(50) NULL,
  //     "LogReaderID" varchar(2) NULL,
  //     "LogReaderName" varchar(50) NULL,
  //     "LogDoorID" varchar(2) NULL,
  //     "LogDoorName" varchar(50) NULL,
  //     "LogInputMode" varchar(3) NULL,
  //     "LogInputID" varchar(3) NULL,
  //     "LogInputType" varchar(3) NULL,
  //     "LogInputName" varchar(50) NULL,
  //     "LogLocationArea" varchar(50) NULL,
  //     "LogLocationFloor" varchar(10) NULL,
  //     "LogPersonID" varchar(30) NULL,
  //     "LogPersonLastName" varchar(50) NULL,
  //     "LogPersonFirstName" varchar(50) NULL,
  //     "LogCompanyID" bigint NULL,
  //     "LogCompanyName" varchar(50) NULL,
  //     "LogDepartmentID" bigint NULL,
  //     "LogDepartmentName" varchar(50) NULL,
  //     "LogTitleID" bigint NULL,
  //     "LogTitleName" varchar(50) NULL,
  //     "LastUpdateDateTime" char(14) NULL,
  //     "LogSystemWorkID" varchar(3) NULL
  // );`

  const buildingTable = `CREATE TABLE IF NOT EXISTS "ob_building" (
    "idx" serial NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "left_location" text,
    "top_location" text,
    "service_type" text,
    "status" text,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    "updated_at" timestamp NOT NULL DEFAULT NOW(),
    "upserted_at" timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT ob_building_idx_servicetype UNIQUE (idx, service_type)
  );`

  const floorTable = `CREATE TABLE IF NOT EXISTS "ob_floor" (
    "idx" serial NOT NULL,
    "name" text NOT NULL,
    "building_idx" integer NOT NULL,
    "description" text,
    "map_image" text NOT NULL,
    "service_type" text,
    "status" text,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    "updated_at" timestamp NOT NULL DEFAULT NOW(),
    "upserted_at" timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT ob_floor_idx_servicetype UNIQUE (idx, service_type)
  );`
    
  const deviceTable = `CREATE TABLE IF NOT EXISTS "ob_device" (
      "idx" serial NOT NULL,
      "id" text NOT NULL,
      "building_idx" integer NOT NULL,
      "building_service_type" TEXT,
      "floor_idx" integer NOT NULL,
      "type" text NOT NULL DEFAULT 'ebell',
      "name" text NOT NULL,
      "location" text NOT NULL DEFAULT '-',
      "ipaddress" text UNIQUE NOT NULL,
      "left_location" text,
      "top_location" text,
      "camera_id" text,
      "camera_id_sub1" text,
      "camera_id_sub2" text,
      "camera_preset_start" text,
      "camera_preset_end" text,
      "status" integer NOT NULL DEFAULT 0,
      "service_type" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      "upserted_at" timestamp NOT NULL DEFAULT NOW(),
      CONSTRAINT ob_device_idx_servicetype UNIQUE (idx, service_type)
    );`

  const eventTable = `CREATE TABLE IF NOT EXISTS "ob_event" (
      "idx" serial NOT NULL,
      "name" text NOT NULL,
      "description" text NOT NULL,
      "id" text NOT NULL,
      "building_idx" integer NOT NULL,
      "floor_idx" integer NOT NULL,
      "event_occurrence_time" text,
      "event_end_time" text,
      "status" integer NOT NULL DEFAULT 0,
      "severity" integer NOT NULL DEFAULT 0,
      "acknowledge" boolean NOT NULL DEFAULT false,
      "acknowledge_user" text,
      "device_type" text,
      "connection" boolean DEFAULT false,
      "ipaddress" text,
      "service_type" text,
      "event_type" integer NOT NULL,
      "camera_id" text,
      "snapshot_path" text,
      "acknowledged_at" timestamp,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      "upserted_at" timestamp NOT NULL DEFAULT NOW(), 
      CONSTRAINT ob_event_idx_servicetype UNIQUE (idx, service_type)
    );`

  const usersTable = `CREATE TABLE IF NOT EXISTS "users" (        
      "id" text NOT NULL PRIMARY KEY,
      "name" text NOT NULL,
      "password" text NOT NULL,
      "email" text,
      "invalidpasswordcount" integer NOT NULL DEFAULT 0,
      "isadmin" boolean NOT NULL DEFAULT false,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`

  const eventTypeTable = `CREATE TABLE IF NOT EXISTS "ob_event_type" (
    "idx" SERIAL primary key,
    "name" text NOT NULL,
    "service_type" text,
    "severity" integer NOT NULL DEFAULT 0,
    "unused" boolean,
    "popup" boolean,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    "updated_at" timestamp NOT NULL DEFAULT NOW()
  );`

  const billBoardTable = `CREATE TABLE IF NOT EXISTS "ob_billboard" (
    "id" text primary key,
    "event_idx" text,
    "device_id" text,
    "service_type" text,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    "updated_at" timestamp NOT NULL DEFAULT NOW()
  );`

  const defaultUserInsert = `INSERT INTO users (id, name, password, email, invalidpasswordcount, isadmin)
      SELECT 'admin00', 'admin', MD5('admin1234'), 'admin@admin.com', 0, true
      WHERE NOT EXISTS (SELECT id FROM users WHERE id = 'admin00');`;

  const defaultEventTypeInsert = `INSERT INTO ob_event_type (idx, name, service_type, severity, unused, popup) VALUES 
    (1, '화재 감지', 'mgist', 3, false, false), 
    (2, '연기 감지', 'mgist', 0, false, false), 
    (3, '움직임 감지', 'mgist', 0, false, false), 
    (4, '배회 감지', 'mgist', 0, false, false), 
    (5, '잃어버린 물건 감지', 'mgist', 0, false, false), 
    (6, '영역 침입 감지', 'mgist', 3, false, false),
    (7, '영역 이탈 감지', 'mgist', 0, false, false), 
    (8, '라인 크로스 감지', 'mgist', 0, false, false), 
    (9, '대기열 감지', 'mgist', 0, false, false), 
    (10, '쓰러짐 감지', 'mgist', 0, false, false), 
    (11, '앉은 자세 감지', 'mgist', 0, false, false), 
    (12, '정지 감지', 'mgist', 0, false, false), 
    (13, '영역 이동 감지', 'mgist', 0, false, false), 
    (14, '피플 카운트', 'mgist', 0, false, false), 
    (15, '근거리 감지', 'mgist', 0, false, false), 
    (16, '난간 잡기 감지', 'mgist', 0, false, false),
    (17, '양손 들기 감지', 'mgist', 0, false, false), 
    (18, '얼굴 감지', 'mgist', 0, false, false), 
    (19, '비상상황 발생', 'ebell', 3, false, false), 
    (20, '전원장치 ON', 'observer', 0, false, false), 
    (21, '전원장치 OFF', 'observer', 0, false, false), 
    (22, '전원장치 RESET', 'observer', 0, false, false), 
    (23, '블랙리스트', 'observer', 0, false, false), 
    (24, '화이트리스트', 'observer', 0, false, false), 
    (25, '화재신호', 'accesscontrol', 3, false, true), 
    (26, '미등록출입시도', 'accesscontrol', 3, false, true),
    (27, '강제출입문열림', 'accesscontrol', 3, false, true),
    (28, '호흡이상감지', 'observer', 3, false, true),
    (29, 'PIDS 이벤트 감지', 'observer', 3, false, true),
    (30, '사람 감지', 'mgist', 0, false, false),
    (31, '차량 감지', 'mgist', 0, false, false),
    (32, '안전모 미착용 감지', 'mgist', 0, false, false),
    (33, '연결 끊어짐', 'ndoctor', 0, false, false),
    (34, '연결 복구', 'ndoctor', 0, false, false),
    (35, '주차금지구역 주차', 'parkingcontrol', 0, false, false),
    (36, '만차', 'parkingcontrol', 0, false, false),
    (37, '금속탐지', 'mdet', 0, false, false),
    (38, '군중 밀집', 'crowddensity', 0, false, false)
    ON CONFLICT (idx) DO NOTHING`;


  const defaultSettingInsert = `INSERT INTO ob_setting (name, setting_value, default_value, description) VALUES
    ('mgist', 'true', 'true', 'Use by service or not by service'),
    ('ebell', 'true', 'true', 'Use by service or not by service'), 
    ('accesscontrol', 'true', 'true', 'Use by service or not by service'), 
    ('guardianlite', 'false', 'false', 'Use by service or not by service'), 
    ('anpr', 'false', 'false', 'Use by service or not by service'), 
    ('vitalsensor', 'true', 'true', 'Use by service or not by service'), 
    ('pids', 'true', 'true', 'Use by service or not by service'),
    ('ndoctor', 'true', 'true', 'Use by service or not by service'),
    ('parkingcontrol', 'true', 'true', 'Use by service or not by service'),
    ('crowddensity', 'true', 'true', 'Use by service or not by service'),
    ('mdet', 'true', 'true', 'Use by service or not by service'),
    ('vitalsensor Data Storage Period', '7', '7', 'vitalsensor Data Storage Period'),
    ('vitalsensor Event Condition', '60:2', '60:2', 'seconds:number of occurrences'),
    ('setting detection time for red-zone', '60', '60', 'Setting Detection Time for No Parking Zone'),
    ('layout1', 'eventStatus:true', 'eventStatus:true', 'layout1 setting'),
    ('layout2', 'eventList:true', 'eventList:true', 'layout2 setting'),
    ('layout3', 'deviceList:true', 'deviceList:true', 'layout3 setting'),
    ('layout4', 'accessCtl:true', 'accessCtl:true', 'layout4 setting')
    ON CONFLICT (name) DO NOTHING`;

  const cameraTable = `CREATE TABLE IF NOT EXISTS "ob_camera" (
      "id" text,
      "building_idx" integer,
      "building_service_type" TEXT,
      "floor_idx" integer,
      "name" text NOT NULL,
      "ipaddress" text,
      "telemetry_control_id" text,
      "telemetry_control_preset" text,
      "left_location" text,
      "top_location" text,
      "status" text,
      "service_type" text DEFAULT 'observer',
	    "vendor" text,
      "model" text,
      "access_point" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      "upserted_at" timestamp NOT NULL DEFAULT NOW(),
      CONSTRAINT ob_camera_id UNIQUE (id)
    );`;

    const pidsTable = `CREATE TABLE IF NOT EXISTS "ob_pids" (
      "idx" SERIAL NOT NULL,
      "id" text,
      "line_x1" text,
      "line_x2" text,
      "line_y1" text,
      "line_y2" text,
      "left_location" text,
      "top_location" text,
      "building_idx" integer,
      "building_service_type" TEXT,
      "floor_idx" integer,
      "type" text,
      "name" text NOT NULL,
      "location" text,
      "ipaddress" text,
      "telemetry_control_id" text,
      "telemetry_control_preset" text,
      "camera_id" text,
      "camera_id_sub1" text,
      "camera_id_sub2" text,
      "camera_id_preset_start" text,
      "camera_id_preset_end" text,
      "status" integer DEFAULT 0,
      "service_type" text DEFAULT 'observer',
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      "upserted_at" timestamp NOT NULL DEFAULT NOW(),
      CONSTRAINT ob_pids_id UNIQUE (id)
    );`;

  const breathLogTable = `CREATE TABLE IF NOT EXISTS "ob_breath_log" (
      "idx" SERIAL PRIMARY KEY,
      "name" text,
      "ipaddress" text,
      "datetime" text,
      "sensor_value" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      "upserted_at" timestamp NOT NULL DEFAULT NOW()
    );`;
    
  const vmsTable = `CREATE TABLE IF NOT EXISTS "ob_vms" (
      "ipaddress" text PRIMARY KEY,
      "port" text NOT NULL,
      "name" text NOT NULL,
      "id" text NOT NULL,
      "password" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

  // const defaultVmsInsert = `INSERT INTO ob_vms (ipaddress, port, name, id, password)
  //     SELECT '192.168.10.57', '89', 'GIT-KTH', 'root', 'root'
  //     WHERE NOT EXISTS (SELECT ipaddress FROM ob_vms WHERE ipaddress = '192.168.10.57');`;

  const guardianliteTable = `CREATE TABLE IF NOT EXISTS "ob_guardianlite" (
    "idx" serial PRIMARY KEY,
    "name" text NOT NULL,
    "ipaddress" text NOT NULL,
    "id" text NOT NULL DEFAULT 'ADMIN',
    "password" text NOT NULL DEFAULT '1234',
    "ch1" text,
    "ch2" text,
    "ch3" text,
    "ch4" text,
    "ch5" text,
    "ch6" text,
    "ch7" text,
    "ch8" text,
    "temper" text,
    "ch1_label" text,
    "ch2_label" text,
    "ch3_label" text,
    "ch4_label" text,
    "ch5_label" text,
    "ch6_label" text,
    "ch7_label" text,
    "ch8_label" text,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    "updated_at" timestamp NOT NULL DEFAULT NOW(),
    "upserted_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const carNumberTable = `CREATE TABLE IF NOT EXISTS "ob_car_number" (
      "idx" serial PRIMARY KEY,
      "type" text NOT NULL,
      "number" text UNIQUE NOT NULL,
      "name" text NOT NULL,
      "description" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const carNumberRecognitionTable = `CREATE TABLE IF NOT EXISTS "ob_car_recognition" (
      "idx" serial PRIMARY KEY,
      "number" text NOT NULL,
      "camera_id" text NOT NULL,
      "recog_time" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const accessControlLogTable = `CREATE TABLE IF NOT EXISTS "ob_access_control_log" (
      "LogIDX" serial PRIMARY KEY, 
      "LogDate" text, 
      "LogTime" text, 
      "LogType" text, 
      "LogStatus" text, 
      "LogStatusName" text, 
      "LogRFID" text, 
      "LogPIN" text, 
      "LogIDType" text, 
      "LogIDCredit" text, 
      "LogAuthType" text, 
      "LogDeviceID" text, 
      "LogDeviceName" text, 
      "LogReaderID" text, 
      "LogReaderName" text, 
      "LogDoorID" text, 
      "LogDoorName" text, 
      "LogInputMode" text, 
      "LogInputID" text, 
      "LogInputType" text, 
      "LogInputName" text, 
      "LogLocationArea" text, 
      "LogLocationFloor" text, 
      "LogPersonID" text, 
      "LogPersonLastName" text, 
      "LogPersonFirstName" text, 
      "LogCompanyID" integer, 
      "LogCompanyName" text, 
      "LogDepartmentID" integer, 
      "LogDepartmentName" text, 
      "LogTitleID" integer, 
      "LogTitleName" text, 
      "LastUpdateDateTime" text, 
      "LogSystemWorkID" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const settingTable = `CREATE TABLE IF NOT EXISTS "ob_setting" (
      "idx" serial PRIMARY KEY,
      "name" text UNIQUE NOT NULL,
      "setting_value" text,
      "default_value" text NOT NULL,
      "description" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const breathSensorTable = `CREATE TABLE IF NOT EXISTS "ob_breathsensor" (
      "idx" serial NOT NULL,
      "name" text NOT NULL,
      "ipaddress" text UNIQUE NOT NULL,
      "location" text,
      "use_status" text,
      "prison_door_status" text,
      "prison_door_id" text,
      "breath_value" text,
      "schedule_time" text,
      "schedule_group" text,
      "install_location" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    // breathSensorTable 테이블 변경 : prison_door_status, prison_door_id 추가
    // ALTER TABLE ob_breathsensor ADD COLUMN prison_door_status TEXT DEFAULT 'lock';
    // ALTER TABLE ob_breathsensor ADD COLUMN prison_door_id TEXT DEFAULT 'lock';

    const breathSensorScheduleGroup = `CREATE TABLE IF NOT EXISTS "ob_breathsensor_schedule" (
      "idx" serial NOT NULL,
      "name" text UNIQUE,
      "schedule_time" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const operationLogTable = `CREATE TABLE IF NOT EXISTS "ob_operation_log" (
      "idx" SERIAL PRIMARY KEY,
      "id" text,
      "ipaddress" text,
      "datetime" text,
      "before_data" text,
      "after_data" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const parkingCameraTable = `CREATE TABLE IF NOT EXISTS "ob_parking_camera" (
      "idx" SERIAL,
      "ipaddress" text UNIQUE PRIMARY KEY,
      "name" text UNIQUE,
      "camera_id" text UNIQUE,
      "id" text,
      "password" text,
      "rtsp_port" text DEFAULT 543,
      "total_available" text DEFAULT 0,
      "total_occupied" text DEFAULT 0,
      "name_updated_at" timestamp NOT NULL DEFAULT NOW(),
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const parkingAreaTable = `CREATE TABLE IF NOT EXISTS "ob_parking_area" (
      "idx" SERIAL PRIMARY KEY,
      "name" text,
      "display_name" text,
      "camera_ip" text,
      "numbering_scheme" text,
      "occupancy" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      CONSTRAINT ob_parking_area_id UNIQUE (camera_ip, name)
    );`;

    const vCounterTable = `CREATE TABLE IF NOT EXISTS "ob_vcounter_count" (
      "idx" SERIAL PRIMARY KEY,
      "name" text,
      "ipaddress" text,
      "port" text DEFAULT 4470,
      "type" text,
      "empty_slots" integer DEFAULT 0,
      "in_count" integer DEFAULT 0,
      "out_count" integer DEFAULT 0,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      CONSTRAINT ob_vcounter_count_id UNIQUE (ipaddress)
    );`;

    const parkingSpaceTable = `CREATE TABLE IF NOT EXISTS "ob_parking_space" (
      "idx" SERIAL PRIMARY KEY,
      "parking_area" text,
      "camera_ip" text,
      "index_number" text,
      "name" text,
      "type" integer,
      "occupancy" text,
      "x1" text,
      "x2" text,
      "x3" text,
      "x4" text,
      "y1" text,
      "y2" text,
      "y3" text,
      "y4" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      CONSTRAINT ob_parking_space_id UNIQUE (camera_ip, parking_area, index_number)
    );`;

    const parkingLogTable = `CREATE TABLE IF NOT EXISTS "ob_parking_control_log" (
      "idx" SERIAL PRIMARY KEY,
      "camera_ip" text,
      "camera_name" text,
      "area" text,
      "area_name" text,
      "index_number" text,
      "occupancy" text,
      "type" integer,
      "x1" text,
      "x2" text,
      "x3" text,
      "x4" text,
      "y1" text,
      "y2" text,
      "y3" text,
      "y4" text,
      "total_available" text,
      "total_occupied" text,
      "cmd" text,
      "occur_at" timestamp NOT NULL DEFAULT NOW(),
      "created_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const vCounterLogTable = `CREATE TABLE IF NOT EXISTS "ob_vcounter_log" (
      "idx" SERIAL PRIMARY KEY,
      "name" text,
      "ipaddress" text,
      "empty_slots" integer,
      "in_count" integer,
      "out_count" integer,
      "cmd" text,
      "occur_at" timestamp NOT NULL DEFAULT NOW(),
      "created_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const crowdDensityCameraTable = `CREATE TABLE IF NOT EXISTS "ob_crowddensity_camera" (
      "idx" SERIAL PRIMARY KEY,
      "ipaddress" text,
      "name" text UNIQUE,
      "id" text,
      "camera_id" text UNIQUE,
      "rtsp_port" text DEFAULT 8554,
      "threshold" text,
      "name_updated_at" timestamp NOT NULL DEFAULT NOW(),
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW()
    );`;

    const crowdDensityLogTable = `CREATE TABLE IF NOT EXISTS "ob_crowddensity_log" (
      "idx" SERIAL PRIMARY KEY,
      "name" text,
      "ipaddress" text,
      "camera_channel" text,
      "datetime" text,
      "count_average" text,
      "threshold" text,
      "created_at" timestamp NOT NULL DEFAULT NOW(),
      "updated_at" timestamp NOT NULL DEFAULT NOW(),
      "upserted_at" timestamp NOT NULL DEFAULT NOW()
    );`;
    
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DBNAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    await client.connect();
    await client.query(buildingTable);
    await client.query(floorTable);
    await client.query(deviceTable);
    await client.query(eventTable);

    await client.query(cameraTable);    // mgist 에서 읽어온 카메라 목록 저장 테이블
    await client.query(pidsTable);
    await client.query(usersTable);
    await client.query(eventTypeTable);
    await client.query(billBoardTable);
    await client.query(defaultUserInsert);
    await client.query(vmsTable);
    // await client.query(defaultVmsInsert);
    await client.query(guardianliteTable);
    await client.query(settingTable);
    await client.query(defaultEventTypeInsert);
    await client.query(defaultSettingInsert);
    await client.query(carNumberTable);
    await client.query(carNumberRecognitionTable);
    await client.query(accessControlLogTable);
    await client.query(breathSensorTable);
    await client.query(breathSensorScheduleGroup);
    await client.query(operationLogTable);
    await client.query(breathLogTable);
    await client.query(parkingCameraTable);
    await client.query(parkingAreaTable);
    await client.query(parkingSpaceTable);
    await client.query(vCounterTable);
    await client.query(parkingLogTable);
    await client.query(vCounterLogTable);
    await client.query(crowdDensityCameraTable);
    await client.query(crowdDensityLogTable);
    await client.end();
  } catch (error) {
    console.log('createTables error', error);
  }
}

// const getLastIdx = async () => {
//     const query1 = `SELECT * FROM "Log_Device_Normal" ORDER BY "LogIDX" DESC LIMIT 1`;
//     const query2 = `SELECT * FROM "system_log" ORDER BY "id" DESC LIMIT 1`;

//     try {
//         const client = new Client({
//             user: 'postgres',
//             host: 'localhost',
//             database: 'observer',
//             password: 'admin1234',
//             port: 5432
//         });
//         await client.connect();
//         const res = await client.query(query1);
//         if (res.rows.length > 0) {
//             Gaus_Log_Device_Normal_idx = res.rows[0].LogIDX;
//         }
//         console.log('Gaus_Log_Device_Normal_idx:', Gaus_Log_Device_Normal_idx);

//         const res2 = await client.query(query2);
//         if (res2.rows.length > 0) {
//             SelCon_system_log_idx = res2.rows[0].id;
//         }
//         console.log('SelCon_system_log_idx:', SelCon_system_log_idx);

//         await client.end();
//     } catch (error) {
//         console.log('createTables error', error);
//     }
// }

exports.initMainDb = async () => {
  try {
    await createDatabase();
    await createTables();
    //await getLastIdx();
  } catch (error) {
    console.log('initMaindb error', error);
  }
}

exports.pgQuery = async (query) => {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DBNAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await client.connect();
    const res = await client.query(query);
    //console.log('res:', res);
    await client.end();
    return res;
  } catch (error) {
    console.log('pgquery_query error:', error);
    console.log('query:', query);
    throw error;
  }
}


//(async()=> {await clientSelect.connect();})();

exports.selectionControlQuery = async () => {
  const clientSelect = new Client({
    host: process.env.SELECTCTL_DB_HOST,
    port: process.env.SELECTCTL_DB_PORT,
    database: process.env.SELECTCTL_DB_DBNAME,
    user: process.env.SELECTCTL_DB_USER,
    password: process.env.SELECTCTL_DB_PASSWORD
  });

  try {
    await clientSelect.connect();
    let query = `SELECT * FROM system_log`;
    if (SelCon_system_log_idx) {
      query += ` WHERE id > ${SelCon_system_log_idx}`;
    }
    query += ' ORDER BY id';
    const res = await clientSelect.query(query);
    //console.log('res(Select):', res.rows[0]);
    await clientSelect.end();
    return res;
  } catch (error) {
    console.log('selectionControlQuery_query error:', error);
  }
}

exports.mssqlQuery = async (query) => {
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    await sql.close();
    return result;
  } catch (error) {
    console.log('query:', query);
    if (error.code === 'ETIMEOUT') {
      console.log(error.message)
    } else {
      console.log('error:', error);
    }
  }


  // try {
  //   await sql.connect({
  //     user: process.env.ACCESSCONTROL_DB_USER,
  //     password: process.env.ACCESSCONTROL_DB_PASSWORD,
  //     server: process.env.ACCESSCONTROL_DB_HOST,
  //     database: process.env.ACCESSCONTROL_DB_DBNAME,
  //     options: {
  //       trustServerCertificate: true,
  //       // history
  //       // 01.26 false -> true 변경 (UnhandledPromiseRejectionWarning: ConnectionError: Connection is closing 해결차원)
  //       // window azure 만 encrypt: true 사용 -> false 복구
  //       encrypt: false, 

  //       useUTC: false,
  //       dateFirst: 1,

  //       // 01.26 AmmunitionDepot option 항목 추가 테스트
  //       max: 10,
  //       min: 0,
  //       idleTimeoutMillis: 3600000,
  //       connectionTimeout: 3600000,
  //       requestTimeout: 3600000,

  //       // 윈도우 서비스 -> SQL Server Browser -> 서비스 자동 변경 -> 재시작 -> 서버 재시작
  //     }
  //   });
    
  //   const result = await sql.query(query);
    
  //   await sql.close();
  //   //console.dir(result.recordset);
  //   return result;
  // } catch (error) {
  //   console.log('query:', query);
  //   if (error.code === 'ETIMEOUT') {
  //     console.log(error.message)
  //   } else {
  //     console.log('error:', error);
  //   }
  // }
}