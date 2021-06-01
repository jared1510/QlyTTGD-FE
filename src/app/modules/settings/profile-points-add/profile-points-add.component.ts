import {Component, OnInit} from '@angular/core';
import {PointsModel} from '../../../shared/model/points-model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LopHocModel} from '../../../shared/model/lop-hoc.model';
import {ApiService} from '../../../shared/service/api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {UserModel} from '../../../shared/model/user-model';

@Component({
  selector: 'app-profile-points-add',
  templateUrl: './profile-points-add.component.html',
  styleUrls: ['./profile-points-add.component.css']
})
export class ProfilePointsAddComponent implements OnInit {

  userList: UserModel[];
  pointModel: PointsModel;
  pointForm: FormGroup;
  lopHoc: LopHocModel[];
  kip1 = 'Kíp 1(7h - 9h)';
  kip2 = 'Kíp 2(9h30- 12h)';
  kip3 = 'Kíp 3(13h-15h)';
  kip4 = 'Kíp 4(15h-18h)';
  kip5 = 'Kíp 5(18h30-21h30)';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    public  activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.apiService.get('/api/user/all').subscribe(data => {
      this.userList = data;
    });
    this.apiService.get('/api/lop-hoc/all').subscribe(res => {
      this.lopHoc = res;
    });
    this.pointForm = this.fb.group({
      idUser: new FormControl('', [Validators.required]),
      kipDay: new FormControl('', [Validators.required]),
      idLop: new FormControl('', [Validators.required]),
      diemMieng: new FormControl('', [Validators.required, Validators.pattern('^(10|\\d)(\\.\\d{1,2})?$')]),
      diem15p: new FormControl('', [Validators.required, Validators.pattern('^(10|\\d)(\\.\\d{1,2})?$')]),
      diem90p: new FormControl('', [Validators.required, Validators.pattern('^(10|\\d)(\\.\\d{1,2})?$')]),
    });
  }

  // tenLop
  onAdd() {
    if (this.pointForm.valid) {
      const points = {
        maLop: this.pointForm.get('idLop').value,
        idUser:  this.pointForm.get('idUser').value,
        diemmieng: this.pointForm.get('diemMieng').value,
        diem15p: this.pointForm.get('diem15p').value,
        diem90p: this.pointForm.get('diem90p').value,
        diemtb: this.parseDiemTB(),
        kipDay: this.pointForm.get('kipDay').value,
      };
      this.apiService.post('/api/diem/add', points).subscribe(res => {
        this.toastr.success('Thêm mới thành công!');
        this.activeModal.dismiss();
        this.apiService.onFilter('add');
      }, error => {
        this.toastr.error('Thêm mới thất bại!');
      });
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }

  parseDiemTB() {
    let diemTB = ((parseFloat(this.pointForm.get('diemMieng').value) + parseFloat(this.pointForm.get('diem15p').value)) + parseFloat(this.pointForm.get('diem90p').value) * 2) / 4;
    return diemTB;
  }

  get f() {
    return this.pointForm.controls;
  }

}
