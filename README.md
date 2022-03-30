# Only-cat 
> เว็บแมวๆ
## เป้าหมาย
สร้าง Web Application ที่มีการใช้ REST API โดยมีเงื่อนไขดังต่อไปนี้
### Backend 
ใช้ Node.js ทำ Web API มี REST API อย่างน้อย 2 resources  
- [x] Social Authentication  
    - [x] Facebook 
- [x] ใช้ไลบรารี express ในการทำ Web API 
- [x] ใช้ไลบรารี winston ในการ log
- [x] มีการบันทึกข้อมูลลงฐานข้อมูล
### Frontend 
พัฒนาฝั่ง Frontend ด้วย React & MUI
- [x] มีการเชื่อมต่อยัง Backend ทั้งในส่วนของการทำ Social Authentication และการการเชื่อมต่อกับ Web API
- [x] สามารถอัพโหลดไฟล์หรือรูปภาพ
- [x] กดไลค์
- [x] ค้นหาข้อมูล

### Deployment

- [x] ทำการ deploy ทั้งตัว Backend และ Frontend ขึ้น Cloud Server 
    - [x] Azure
- [x] ใช้ nginx เป็น reverse proxy
- [x] ใช้ docker ในการ deploy (และใช้สำหรับ develop)
- [x] ใช้ pm2 ในการ deploy node.js application
- [ ] ใช้ let’s encrypt ในการออก certificate สำหรับ https

---

### by
- 6210110242 [Piravit Chenpittaya](https://github.com/karnzx)
- 6210110383 [Suttirak Mattayawerakiat](https://github.com/suttirak-mattaya)
