const fs = require('fs-extra');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const targetDir = path.join(__dirname, '..', 'NewSpringProject', 'src', 'main', 'webapp', 'react');

fs.removeSync(targetDir); // 기존 삭제
fs.copySync(buildDir, targetDir); // 새로 복사

console.log('✅ React build 결과가 Spring 프로젝트에 복사되었습니다.');
