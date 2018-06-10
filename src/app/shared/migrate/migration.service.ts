import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MigrateSkill {
  children?: Array<MigrateSkill>;
  id?: string;
  parentId?: string;
  position?: number;
  text?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  constructor(private httpService: HttpClient) {

  }

  private print(skill: MigrateSkill) {
    console.log('INSERT INTO skill (id, text, type, comments, position, parent_skill) VALUES(' + skill.id + ',\'' + skill.text + '\',\'' + skill.type + '\',\'\',' + skill.position + ',' + skill.parentId + ');\n');
    if (skill.children) {
      for (let i = 0; i < skill.children.length; i++) {
        skill.children[i].id = skill.children[i].id.replace('skill_', '20');
        if (!skill.children[i].parentId) {
          skill.children[i].parentId = skill.id;
        }
        if (!skill.children[i].position) {
          skill.children[i].position = 100 + i;
        }
        this.print(skill.children[i]);
      }
    }
  }

  public migrate() {
    this.httpService.get('./skills.json')
      .subscribe(
        (data: MigrateSkill[]) => {
          for (let i = 0; i < data.length; i++) {
            data[i].parentId = '0';
            if (!data[i].position) {
              data[i].position = 100 + i;
            }
            this.print(data[i]);
          }
        }
      );
  }
}